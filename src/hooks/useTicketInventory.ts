
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTicketInventory = () => {
  const [isChecking, setIsChecking] = useState(false);

  // Check if tickets are available before proceeding with checkout
  const checkTicketAvailability = async (
    eventId: number, 
    ticketType: string, 
    tierTitle: string, 
    quantity: number
  ) => {
    setIsChecking(true);
    
    try {
      console.log(`Checking availability for event ${eventId}, ticket type ${ticketType}, tier ${tierTitle}, quantity ${quantity}`);
      
      // Special case for May 24 event (ID: 1) which is sold out
      if (eventId === 1) {
        toast.error('This event is completely sold out.');
        return false;
      }
      
      // Using the index on ticket_type and tier_title for faster lookups
      const { data, error } = await supabase
        .from('event_tier_inventory')
        .select('available_quantity, is_active')
        .eq('event_id', eventId)
        .eq('ticket_type', ticketType)
        .eq('tier_title', tierTitle)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking ticket availability:', error);
        toast.error('Unable to check ticket availability. Please try again or contact support.');
        return false;
      }
      
      // If no inventory data found
      if (!data) {
        console.error('No inventory data found for this ticket type/tier', {
          eventId,
          ticketType,
          tierTitle
        });
        toast.error('This ticket type is not currently available for purchase.');
        return false;
      }
      
      // Check if tier is active
      if (!data.is_active) {
        console.error('Ticket tier is not active', {
          eventId,
          ticketType,
          tierTitle,
          isActive: data.is_active
        });
        toast.error('This ticket tier is not currently available for purchase.');
        return false;
      }
      
      // Check if enough tickets are available
      if (data.available_quantity < quantity) {
        if (data.available_quantity === 0) {
          toast.error('Sorry, this ticket tier is sold out.');
        } else {
          toast.error(`Only ${data.available_quantity} tickets available in this tier.`);
        }
        return false;
      }
      
      // If we've gotten this far, tickets are available
      console.log('Tickets are available', {
        eventId,
        ticketType,
        tierTitle,
        requestedQuantity: quantity,
        availableQuantity: data.available_quantity,
        isActive: data.is_active
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected error checking ticket availability:', error);
      toast.error('Unable to verify ticket availability. Please try again or contact support.');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    checkTicketAvailability
  };
};
