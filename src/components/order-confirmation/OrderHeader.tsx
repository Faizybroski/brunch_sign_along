
import React from 'react';
import { TicketCheck, Package } from 'lucide-react';
import { Receipt } from 'lucide-react';

interface OrderHeaderProps {
  orderType: string;
  formattedOrderId: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ orderType, formattedOrderId }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        {orderType === 'ticket' ? (
          <TicketCheck className="h-8 w-8 text-green-600" />
        ) : (
          <Package className="h-8 w-8 text-green-600" />
        )}
      </div>
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brunch-purple to-brunch-accent bg-clip-text text-transparent">
        Order Confirmed!
      </h1>
      <p className="text-gray-600 mb-2">Thank you for your purchase</p>
      <div className="flex items-center justify-center gap-2 text-brunch-purple mb-2">
        <Receipt className="h-4 w-4" />
        <p className="text-sm">Order #: {formattedOrderId}</p>
      </div>
    </div>
  );
};

export default OrderHeader;
