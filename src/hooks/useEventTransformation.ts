
import { Event, TransformedEvent } from './types';
import { generateTiersFromInventory, getDefaultFoodService } from '@/utils/eventInventoryUtils';
import { getEventMappings, getDefaultEventDetails } from '@/utils/eventMappingsUtils';

export const useEventTransformation = () => {
  const transformEventData = (event: Event): TransformedEvent => {
    // Get default event details and mappings
    const defaultEventDetails = getDefaultEventDetails();
    const eventMappings = getEventMappings();
    
    // Generate tiers based on inventory data if available
    const tiers = generateTiersFromInventory(event.inventory || []);
    // Get default food service info
    const foodService = getDefaultFoodService();

    // Apply mapped values if this is a known event ID
    const eventId = event.id || 0;
    const mappedValues = eventMappings[eventId] || {};

    // Make sure we always have image field populated, either from mappings or original data
    const finalImage = mappedValues?.image || event.image_url || '';

    return {
      ...defaultEventDetails, // Set defaults first
      ...event, // Override with any data from the actual event
      ...mappedValues, // Then override with our mapped values for consistency
      image: finalImage, // Ensure image is always set
      image_url: mappedValues?.image_url || event.image_url || finalImage, // Ensure image_url is always set
      tiers,
      foodService
    };
  };

  return { transformEventData };
};
