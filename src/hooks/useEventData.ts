
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, TransformedEvent } from './types';
import { useEventTransformation } from './useEventTransformation';

export { type Event, type TransformedEvent };

export const useEventData = (eventId?: string | number) => {
  const { transformEventData } = useEventTransformation();

  const fetchEvent = async (id: string | number) => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    try {
      // Using our new event_id index for faster lookups
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', numericId)
        .single();

      if (eventError) {
        console.log('Error fetching event:', eventError);
        return transformEventData({ id: numericId } as Event);
      }
      
      if (!event) {
        console.log('Event not found for ID:', numericId);
        return transformEventData({ id: numericId } as Event);
      }

      // Using our new event_id index on inventory table for faster lookups
      const { data: inventory, error: inventoryError } = await supabase
        .from('event_tier_inventory')
        .select('*')
        .eq('event_id', numericId)
        .order('price', { ascending: true });
      
      if (inventoryError) {
        console.log('Error fetching inventory:', inventoryError);
        return transformEventData(event as Event);
      }
      
      // Add the inventory to the event object
      const eventWithInventory = { ...event, inventory: inventory || [] } as Event;
      return transformEventData(eventWithInventory);
    } catch (error) {
      console.error('Unexpected error fetching event:', error);
      return transformEventData({ id: numericId } as Event);
    }
  };

  const fetchEvents = async () => {
    try {
      // Using cached query for improved performance
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching events:', error);
      return [];
    }
  };

  if (eventId) {
    return useQuery({
      queryKey: ['event', eventId],
      queryFn: () => fetchEvent(eventId),
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }

  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
