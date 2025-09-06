
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { TransformedEvent } from './types';
import { VIPPackage } from './useVIPPackages';
import { determineTierPrice } from '@/utils/tierUtils';
import { calculateOrderTotals, formatPrice } from '@/utils/priceUtils';
import { sendOrderConfirmationEmail } from '@/utils/emailUtils';
import { useTicketInventory } from './useTicketInventory'; 

interface UseCheckoutHandlerProps {
  eventId: string | undefined;
  ticketType: string;
  tierTitle: string;
  tierPrice: number;
  quantity: number;
  event: TransformedEvent;
  vipPackages: VIPPackage[] | undefined;
}

export const useCheckoutHandler = ({
  eventId,
  ticketType,
  tierTitle,
  tierPrice,
  quantity,
  event,
  vipPackages
}: UseCheckoutHandlerProps) => {
  const navigate = useNavigate();
  const { checkTicketAvailability, isChecking } = useTicketInventory();

  const getTierPrice = () => {
    return determineTierPrice(ticketType, tierTitle, event, vipPackages);
  };

  const saveOrderToDatabase = async (orderData: any) => {
    try {
      // First, create or get the customer
      const { data: existingCustomer, error: customerCheckError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', orderData.email)
        .maybeSingle();

      if (customerCheckError) {
        console.error('Error checking existing customer:', customerCheckError);
        throw new Error('Failed to verify customer information');
      }

      let customerId = existingCustomer?.id;

      if (!customerId) {
        // Create new customer
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            birthdate: orderData.birthdate
          })
          .select('id')
          .single();

        if (customerError) {
          console.error('Error creating customer:', customerError);
          throw new Error('Failed to create customer record');
        }

        customerId = newCustomer.id;
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderData.orderId,
          customer_id: customerId,
          total_amount: orderData.total,
          payment_status: 'completed',
          order_source: 'website'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error('Failed to create order record');
      }

      // Create the event ticket record
      const { error: ticketError } = await supabase
        .from('event_tickets')
        .insert({
          order_id: orderData.orderId,
          event_id: parseInt(eventId || '0'),
          ticket_type: ticketType,
          tier_title: tierTitle,
          quantity: quantity,
          unit_price: orderData.ticketPrice,
          includes_food_service: orderData.includeFoodService,
          food_service_price: orderData.includeFoodService ? orderData.foodServicePrice : 0,
          purchase_date: new Date().toISOString()
        });

      if (ticketError) {
        console.error('Error creating event ticket:', ticketError);
        throw new Error('Failed to create ticket record');
      }

      console.log('Order saved successfully:', {
        orderId: orderData.orderId,
        customerId,
        ticketInfo: {
          eventId,
          ticketType,
          tierTitle,
          quantity
        }
      });

      return { success: true, customerId, orderId: orderData.orderId };
    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    }
  };

  const handleFormSubmit = async (data: any, foodServicePrice: number) => {
    // Check ticket availability first
    const numericEventId = eventId ? parseInt(eventId, 10) : 0;
    
    toast.loading("Verifying ticket availability...");
    
    if (!await checkTicketAvailability(numericEventId, ticketType, tierTitle, quantity)) {
      toast.dismiss();
      return;
    }
    
    toast.loading("Processing your order...");
    
    try {
      // Generate a unique order ID
      const orderId = uuidv4();
      
      // Ensure we have the correct tier price
      const actualTierPrice = tierPrice > 0 ? tierPrice : getTierPrice();
      
      // Calculate all costs using our utility
      const { ticketSubtotal, foodServiceCost, subtotal, taxAndFees, total } = calculateOrderTotals(
        actualTierPrice,
        quantity,
        data.includeFoodService,
        foodServicePrice
      );

      const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '';

      const eventTitle = event.title || 'Event';

      // Prepare order data for database
      const orderData = {
        orderId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate,
        ticketPrice: actualTierPrice,
        includeFoodService: data.includeFoodService,
        foodServicePrice,
        total,
        subtotal,
        taxAndFees
      };

      // Log the values for debugging
      console.log("Processing order with data:", {
        ...orderData,
        eventId: numericEventId,
        ticketType,
        tierTitle,
        quantity
      });

      // Save order to database first
      toast.loading("Saving order details...");
      const dbResult = await saveOrderToDatabase(orderData);
      
      if (!dbResult.success) {
        throw new Error('Failed to save order to database');
      }

      // Send email with the order confirmation
      toast.loading("Sending confirmation email...");
      const emailPayload = {
        orderId,
        email: data.email,
        eventTitle,
        eventDate: formattedDate,
        quantity: quantity.toString(),
        ticketType: ticketType.toUpperCase(),
        ticketPrice: formatPrice(actualTierPrice),
        includeFoodService: data.includeFoodService,
        foodServicePrice: formatPrice(foodServicePrice),
        taxAndFees: formatPrice(taxAndFees),
        total: formatPrice(total),
        subtotal: formatPrice(subtotal)
      };
      
      const { emailSent, emailError, simulatedEmail } = await sendOrderConfirmationEmail(emailPayload);
      
      // Prepare URL parameters for navigation
      const params = new URLSearchParams({
        orderId,
        total: formatPrice(total),
        subtotal: formatPrice(subtotal),
        taxAndFees: formatPrice(taxAndFees),
        quantity: quantity.toString(),
        eventTitle,
        eventDate: formattedDate,
        includeFoodService: data.includeFoodService.toString(),
        foodServicePrice: formatPrice(foodServicePrice),
        ticketPrice: formatPrice(actualTierPrice),
        ticketType: ticketType.toUpperCase(),
        emailSent: (emailSent || simulatedEmail).toString(),
        emailError: emailError ? 'true' : 'false',
        simulatedEmail: simulatedEmail.toString(),
        forceHideBadge: "false"
      });
      
      // Debug the URL parameters
      console.log("Order completed successfully:", {
        orderId,
        customerId: dbResult.customerId,
        emailStatus: emailSent || simulatedEmail ? 'sent' : 'failed'
      });
      
      toast.dismiss();
      toast.success("Order processed and saved successfully!");
      
      setTimeout(() => {
        navigate(`/order-confirmation?${params.toString()}`);
      }, 1500);

    } catch (error) {
      console.error("Error during checkout process:", error);
      toast.dismiss();
      
      // Show specific error message based on the type of error
      if (error instanceof Error) {
        if (error.message.includes('customer')) {
          toast.error("Failed to save customer information. Please try again.");
        } else if (error.message.includes('order')) {
          toast.error("Failed to process order. Please try again.");
        } else if (error.message.includes('ticket')) {
          toast.error("Failed to reserve tickets. Please try again.");
        } else {
          toast.error("There was an error processing your order. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return {
    handleFormSubmit,
    getTierPrice,
    isChecking
  };
};
