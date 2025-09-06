
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OrderSummaryProps {
  quantity: number;
  ticketType: string;
  ticketPrice: number;
  foodServicePrice: number;
  includeFoodService: boolean;
  total: number;
}

const OrderSummary = ({
  quantity,
  ticketType,
  ticketPrice,
  foodServicePrice,
  includeFoodService,
  total
}: OrderSummaryProps) => {
  // Ensure valid numeric values
  const validTicketPrice = isNaN(ticketPrice) ? 0 : ticketPrice;
  const validFoodServicePrice = isNaN(foodServicePrice) ? 0 : foodServicePrice;
  const validQuantity = isNaN(quantity) ? 0 : quantity;
  
  const subtotal = validTicketPrice * validQuantity;
  const foodServiceTotal = includeFoodService ? validFoodServicePrice * validQuantity : 0;
  const baseAmount = subtotal + foodServiceTotal;
  const taxAndServiceFee = baseAmount * 0.14975;
  const calculatedTotal = baseAmount + taxAndServiceFee;
  const displayTotal = isNaN(total) ? calculatedTotal : total;

  console.log("OrderSummary values:", {
    ticketPrice: validTicketPrice,
    quantity: validQuantity,
    subtotal,
    foodServiceTotal,
    taxAndServiceFee,
    calculatedTotal,
    displayTotal
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{validQuantity} × {ticketType.toUpperCase()} Ticket</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {includeFoodService && (
              <div className="flex justify-between">
                <span>{validQuantity} × Food Service</span>
                <span>${foodServiceTotal.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600">
              <span>Tax & Service Fee</span>
              <span>${taxAndServiceFee.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${displayTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
