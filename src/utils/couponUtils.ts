
/**
 * Coupon related utility functions
 */

export interface MerchandiseCoupon {
  code: string;
  discount: number;
  minPurchase: number;
  orderId: string;
  expiry: number;
}

/**
 * Gets the currently active merchandise coupon from localStorage
 */
export const getActiveMerchandiseCoupon = (): MerchandiseCoupon | null => {
  try {
    const couponStr = localStorage.getItem('merchandise_coupon');
    if (!couponStr) return null;
    
    const coupon: MerchandiseCoupon = JSON.parse(couponStr);
    
    // Check if coupon is expired
    if (coupon.expiry < Date.now()) {
      // Clear expired coupon
      localStorage.removeItem('merchandise_coupon');
      return null;
    }
    
    return coupon;
  } catch (e) {
    console.error('Error parsing coupon from localStorage:', e);
    return null;
  }
};

/**
 * Applies coupon discount if the subtotal meets the minimum purchase requirement
 */
export const applyCouponDiscount = (subtotal: number): {
  discountApplied: boolean;
  discountAmount: number;
  finalTotal: number;
  coupon: MerchandiseCoupon | null;
} => {
  const coupon = getActiveMerchandiseCoupon();
  
  // If no valid coupon or subtotal doesn't meet minimum purchase requirement
  if (!coupon || subtotal < coupon.minPurchase) {
    return {
      discountApplied: false,
      discountAmount: 0,
      finalTotal: subtotal,
      coupon: coupon
    };
  }
  
  // Apply discount
  return {
    discountApplied: true,
    discountAmount: coupon.discount,
    finalTotal: subtotal - coupon.discount,
    coupon
  };
};

/**
 * Clear the coupon from localStorage (e.g., after successful purchase)
 */
export const clearCoupon = (): void => {
  localStorage.removeItem('merchandise_coupon');
};
