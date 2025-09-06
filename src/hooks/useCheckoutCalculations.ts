
import { useState, useEffect } from 'react';

export const useCheckoutCalculations = (
  tierPrice: number | string,
  quantity: number,
  foodServicePrice: number,
  includeFoodService: boolean
) => {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [foodServiceTotal, setFoodServiceTotal] = useState(0);
  const [taxAndServiceFee, setTaxAndServiceFee] = useState(0);

  // For debugging
  console.log("useCheckoutCalculations inputs:", {
    tierPrice,
    quantity,
    foodServicePrice,
    includeFoodService
  });

  // Update subtotal when ticket price or quantity changes
  useEffect(() => {
    // Parse tierPrice if it's a string (e.g., "$59")
    const parsedTierPrice = typeof tierPrice === 'string' 
      ? parseFloat(tierPrice.replace(/[^0-9.-]+/g, ''))
      : tierPrice;
    
    // Ensure valid numeric values
    const validTierPrice = isNaN(parsedTierPrice) ? 0 : parsedTierPrice;
    const validQuantity = isNaN(quantity) ? 0 : quantity;
    
    const calculatedSubtotal = validTierPrice * validQuantity;
    setSubtotal(calculatedSubtotal);
    
    console.log("Subtotal calculation:", {
      originalTierPrice: tierPrice,
      parsedTierPrice,
      validTierPrice,
      validQuantity,
      calculatedSubtotal
    });
  }, [tierPrice, quantity]);

  // Update food service total, tax & service fee, and overall total
  useEffect(() => {
    // Ensure valid numeric values
    const validFoodServicePrice = isNaN(foodServicePrice) ? 0 : foodServicePrice;
    const validQuantity = isNaN(quantity) ? 0 : quantity;
    
    const calculatedFoodServiceTotal = includeFoodService ? validFoodServicePrice * validQuantity : 0;
    setFoodServiceTotal(calculatedFoodServiceTotal);
    
    // Calculate tax and service fee (14.975%)
    const baseAmount = subtotal + calculatedFoodServiceTotal;
    const calculatedTaxAndServiceFee = baseAmount * 0.14975;
    setTaxAndServiceFee(calculatedTaxAndServiceFee);
    
    // Calculate total with tax and service fee
    const calculatedTotal = baseAmount + calculatedTaxAndServiceFee;
    setTotal(calculatedTotal);
    
    console.log("Total calculation:", {
      subtotal,
      calculatedFoodServiceTotal,
      calculatedTaxAndServiceFee,
      newTotal: calculatedTotal
    });
  }, [includeFoodService, subtotal, quantity, foodServicePrice]);

  return {
    subtotal,
    foodServiceTotal,
    taxAndServiceFee,
    total
  };
};
