
import { VIPPackage } from '@/hooks/useVIPPackages';
import { parsePriceValue } from './priceUtils';

/**
 * Find a tier by title in a list of tiers
 */
export const findTier = (tiers: any[] | undefined, title: string) => {
  if (!tiers || tiers.length === 0) return undefined;
  return tiers.find(t => t.title === title) || tiers[0];
};

/**
 * Determine the correct tier price based on ticket type and available tiers
 */
export const determineTierPrice = (
  ticketType: string, 
  tierTitle: string, 
  event: any,
  vipPackages: VIPPackage[] | undefined
): number => {
  if (ticketType === 'group' && vipPackages?.length) {
    const tier = vipPackages.find(pkg => pkg.package_name === tierTitle) || 
      { package_name: tierTitle, price: 599, description: "VIP Group Package" };
    return parsePriceValue(tier.price || 599);
  }
  
  if (!event.tiers) {
    return 39; // Default price if no tiers are defined
  }
  
  const tierList = event.tiers[ticketType as keyof typeof event.tiers];
  const tier = findTier(tierList, tierTitle);
  return parsePriceValue(tier?.price || 39);
};
