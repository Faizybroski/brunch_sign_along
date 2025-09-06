
/**
 * Utility functions for price formatting and calculations
 */

/**
 * Parse a price value from various formats into a number
 */
export const parsePriceValue = (price: any): number => {
  if (typeof price === 'number') {
    return price;
  }
  
  if (typeof price === 'string') {
    const cleanPrice = price.replace(/[^0-9.]/g, '');
    const parsedPrice = parseFloat(cleanPrice);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  }
  
  return 0;
};

/**
 * Format a number as a price string with 2 decimal places
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Calculate order totals based on ticket and food service selections
 */
export const calculateOrderTotals = (
  ticketPrice: number,
  quantity: number,
  includeFoodService: boolean,
  foodServicePrice: number
) => {
  const ticketSubtotal = ticketPrice * quantity;
  const foodServiceCost = includeFoodService ? foodServicePrice * quantity : 0;
  const subtotal = ticketSubtotal + foodServiceCost;
  const taxAndFees = subtotal * 0.14975;
  const total = subtotal + taxAndFees;

  return {
    ticketSubtotal,
    foodServiceCost,
    subtotal,
    taxAndFees,
    total
  };
};
