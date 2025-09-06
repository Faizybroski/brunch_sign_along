
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TicketDetails from './TicketDetails';
import MerchandiseDetails from './MerchandiseDetails';
import FoodServiceDetails from './FoodServiceDetails';
import DeliveryDetails from './DeliveryDetails';
import OrderSummaryDetails from './OrderSummaryDetails';

interface OrderDetailsProps {
  orderType: string;
  // Ticket specific props
  eventTitle?: string;
  eventDate?: string;
  ticketType?: string;
  ticketPrice?: string;
  includeFoodService?: boolean;
  foodServicePrice?: string;
  // Merchandise specific props
  itemName?: string;
  itemPrice?: string;
  deliveryMethod?: string;
  address?: string;
  // Common props
  quantity: string;
  taxAndFees: string;
  subtotal: string;
  total: string;
  shippingFee?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderType,
  eventTitle = '',
  eventDate = '',
  ticketType = '',
  ticketPrice = '',
  includeFoodService = false,
  foodServicePrice = '0',
  itemName = '',
  itemPrice = '',
  deliveryMethod = '',
  address = '',
  quantity,
  taxAndFees,
  subtotal,
  total,
  shippingFee = '0'
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {orderType === 'ticket' ? (
            <TicketDetails 
              eventTitle={eventTitle}
              eventDate={eventDate}
              quantity={quantity}
              ticketType={ticketType}
              ticketPrice={ticketPrice}
            />
          ) : (
            <MerchandiseDetails 
              itemName={itemName}
              quantity={quantity}
              itemPrice={itemPrice}
            />
          )}

          {includeFoodService && orderType === 'ticket' && (
            <FoodServiceDetails 
              quantity={quantity}
              foodServicePrice={foodServicePrice}
            />
          )}
          
          {orderType === 'merchandise' && (
            <DeliveryDetails 
              deliveryMethod={deliveryMethod}
              address={address}
              shippingFee={shippingFee}
            />
          )}
          
          <OrderSummaryDetails
            orderType={orderType}
            ticketPrice={ticketPrice}
            foodServicePrice={foodServicePrice}
            quantity={quantity}
            includeFoodService={includeFoodService}
            subtotal={subtotal}
            shippingFee={shippingFee}
            taxAndFees={taxAndFees}
            total={total}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
