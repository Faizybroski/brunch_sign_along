import { EventTierInventory, TicketTier } from "@/hooks/types";

/**
 * Processes inventory items into standardized ticket tiers
 */
export const processTierItems = (
  items: EventTierInventory[],
  defaultFeatures: string[],
  tierType: string
): TicketTier[] => {
  // Sort items by price to identify the early bird tier (lowest price)
  const sortedItems = [...items].sort((a, b) => a.price - b.price);
  const earlyBirdTier = sortedItems.length > 0 ? sortedItems[0] : null;
  
  return items.map((item) => {
    // If this is the early bird tier (lowest price), set it as active and primary
    const isEarlyBird = earlyBirdTier ? item.id === earlyBirdTier.id : false;
    
    return {
      title: item.tier_title,
      price: item.price.toString(),
      description:
        tierType === "ga"
          ? "Perfect for the casual bruncher"
          : "Enhanced brunch experience",
      ticketsLeft: item.available_quantity,
      primary: isEarlyBird,  // Mark the early bird tier as primary
      soldOut: item.available_quantity <= 0,
      disabled: !isEarlyBird,  // Only enable early bird tier initially
      features: defaultFeatures,
    };
  });
};

/**
 * Default features for different ticket types
 */
export const getDefaultFeatures = (tierType: "ga" | "vip" | "group"): string[] => {
  const baseFeatures = [
    "Show Admission",
    "Inflatable Microphone",
    "Complimentary Mimosa",
    "Dance Floor Access",
  ];

  if (tierType === "ga") {
    return [
      ...baseFeatures,
      "Limited Seating - First Come, First Served"
    ];
  } else if (tierType === "vip") {
    return [
      ...baseFeatures,
      "Reserved VIP Seating",
      "Confetti Popper"
    ];
  } else {
    return [
      ...baseFeatures,
      "Reserved VIP Booth Seating",
      "Confetti Popper"
    ];
  }
};

/**
 * Creates ticket tiers from inventory data
 */
export const createTiersFromInventory = (
  inventory: EventTierInventory[] = [],
  fallbackTiers: any
) => {
  const gaInventory = inventory.filter((item) => item.ticket_type === "ga");
  const vipInventory = inventory.filter((item) => item.ticket_type === "vip");

  // Get default features
  const gaFeatures = getDefaultFeatures("ga");
  const vipFeatures = getDefaultFeatures("vip");

  return {
    ga:
      gaInventory.length > 0
        ? processTierItems(gaInventory, gaFeatures, "ga")
        : fallbackTiers.ga,
    vip:
      vipInventory.length > 0
        ? processTierItems(vipInventory, vipFeatures, "vip")
        : fallbackTiers.vip,
    group: fallbackTiers.group, // Keep default group packages
  };
};
