
import { TransformedEvent } from './types';
import { createTiersFromInventory } from '@/utils/eventTiersUtils';
import { getFallbackEvents, getDefaultFoodService } from '@/utils/eventDefaultsUtils';

export const useNormalizeEventData = () => {
  /**
   * Normalizes event data from API into our TransformedEvent format
   */
  const normalizeEventData = (eventData: any): TransformedEvent => {
    // Get default event data as fallback
    const fallbackEvents = getFallbackEvents();
    
    if (!eventData) {
      return fallbackEvents[0];
    }
    
    // Handle array case (API sometimes returns array of events)
    if (Array.isArray(eventData)) {
      const firstEvent = eventData[0];
      if (!firstEvent) return fallbackEvents[0];
      
      const inventory = firstEvent.inventory || [];
      const tiers = createTiersFromInventory(inventory, fallbackEvents[0].tiers);
      
      return {
        id: firstEvent.id,
        title: firstEvent.title,
        date: firstEvent.date,
        time: firstEvent.time,
        location: firstEvent.location,
        image: firstEvent.image_url,
        image_url: firstEvent.image_url,
        city: firstEvent.city,
        tiers,
        foodService: getDefaultFoodService()
      };
    }
    
    // Handle object case
    if (eventData && typeof eventData === 'object') {
      const inventory = eventData.inventory || [];
      const tiers = createTiersFromInventory(inventory, fallbackEvents[0].tiers);
      
      return {
        ...eventData,
        image: eventData.image || eventData.image_url || '',
        image_url: eventData.image_url || eventData.image || '',
        city: eventData.city,
        tiers,
        foodService: eventData.foodService || getDefaultFoodService()
      };
    }
    
    return fallbackEvents[0];
  };

  /**
   * Ensures all required event data is present, filling in defaults where needed
   */
  const ensureEventData = (event: TransformedEvent): TransformedEvent => {
    const fallbackEvents = getFallbackEvents();
    
    if (!event.tiers) {
      event.tiers = {
        ga: [
          {
            title: "General Admission",
            price: "39",
            description: "Standard General Admission",
            ticketsLeft: 50,
            primary: true,
            soldOut: false,
            disabled: false,
            features: []
          }
        ],
        vip: [
          {
            title: "VIP Experience",
            price: "69",
            description: "Enhanced VIP Experience",
            ticketsLeft: 25,
            primary: true,
            soldOut: false,
            disabled: false,
            features: []
          }
        ],
        group: []
      };
    }
    
    if (!event.tiers.ga) event.tiers.ga = [];
    if (!event.tiers.vip) event.tiers.vip = [];
    if (!event.tiers.group) event.tiers.group = [];

    // Ensure each tier has the required properties
    ['ga', 'vip', 'group'].forEach(tierType => {
      if (event.tiers && Array.isArray(event.tiers[tierType as keyof typeof event.tiers])) {
        event.tiers[tierType as keyof typeof event.tiers] = event.tiers[tierType as keyof typeof event.tiers].map((tier: any) => ({
          ...tier,
          price: tier.price?.toString() || "0",
          ticketsLeft: tier.ticketsLeft || 0,
          primary: tier.primary ?? false,
          soldOut: tier.soldOut ?? false,
          disabled: tier.disabled ?? false,
          features: tier.features || []
        }));
      }
    });

    if (!event.foodService) {
      event.foodService = getDefaultFoodService();
    }

    return event;
  };

  return {
    normalizeEventData,
    ensureEventData
  };
};
