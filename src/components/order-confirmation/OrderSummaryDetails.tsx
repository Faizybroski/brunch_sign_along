
import React from 'react';
import { parsePriceValue, formatPrice } from '@/utils/priceUtils';

interface OrderSummaryDetailsProps {
  orderType: string;
  ticketPrice?: string;
  foodServicePrice?: string;
  quantity: string;
  includeFoodService?: boolean;
  subtotal: string;
  shippingFee?: string;
  taxAndFees: string;
  total: string;
}

const OrderSummaryDetails: React.FC<OrderSummaryDetailsProps> = ({
  orderType,
  ticketPrice = '0',
  foodServicePrice = '0',
  quantity,
  includeFoodService = false,
  subtotal,
  shippingFee = '0',
  taxAndFees,
  total
}) => {
  // Parse all price values
  const parsedTicketPrice = parsePriceValue(ticketPrice);
  const parsedFoodServicePrice = parsePriceValue(foodServicePrice);
  const parsedQuantity = parseInt(quantity, 10) || 0;
  const parsedShippingFee = parsePriceValue(shippingFee);
  
  // Calculate ticket subtotal
  const calculatedTicketSubtotal = parsedTicketPrice * parsedQuantity;
  
  // Calculate food service subtotal if applicable
  const calculatedFoodServiceSubtotal = includeFoodService ? 
    parsedFoodServicePrice * parsedQuantity : 0;
  
  // Format for display
  const displayTicketSubtotal = formatPrice(calculatedTicketSubtotal);
  const displayFoodServiceSubtotal = formatPrice(calculatedFoodServiceSubtotal);

  return (
    <div className="border-t pt-4">
      {orderType === 'ticket' ? (
        // Ticket order summary
        <>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tickets subtotal</span>
            <span className="text-gray-900">
              ${displayTicketSubtotal}
            </span>
          </div>

          {includeFoodService && calculatedFoodServiceSubtotal > 0 && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Food service</span>
              <span className="text-gray-900">
                ${displayFoodServiceSubtotal}
              </span>
            </div>
          )}
        </>
      ) : (
        // Merchandise order summary
        <>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Item subtotal</span>
            <span className="text-gray-900">
              ${subtotal}
            </span>
          </div>

          {parsedShippingFee > 0 && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Shipping fee</span>
              <span className="text-gray-900">
                ${formatPrice(parsedShippingFee)}
              </span>
            </div>
          )}
        </>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-600">Tax & {orderType === 'ticket' ? 'Service Fee' : 'Fees'}</span>
        <span className="text-gray-900">
          ${parseFloat(taxAndFees).toFixed(2)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-4 font-bold">
        <span>Total Paid</span>
        <span className="text-xl text-brunch-purple">
          ${parseFloat(total).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummaryDetails;
