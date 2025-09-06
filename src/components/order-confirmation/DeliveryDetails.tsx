
import React from 'react';
import { Truck, MapPin } from 'lucide-react';

interface DeliveryDetailsProps {
  deliveryMethod: string;
  address: string;
  shippingFee: string;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  deliveryMethod,
  address,
  shippingFee
}) => {
  return (
    <div className="flex items-start gap-4">
      {deliveryMethod === 'ship' ? (
        <Truck className="h-5 w-5 text-brunch-orange flex-shrink-0 mt-1" />
      ) : (
        <MapPin className="h-5 w-5 text-brunch-orange flex-shrink-0 mt-1" />
      )}
      <div>
        <h3 className="font-semibold">
          {deliveryMethod === 'ship' ? 'Shipping Details' : 'Event Pickup Details'}
        </h3>
        {deliveryMethod === 'ship' ? (
          <>
            <p className="text-gray-600">Shipping to:</p>
            <p className="text-gray-600">{address}</p>
            {parseFloat(shippingFee) > 0 && (
              <p className="text-gray-600 mt-1">Shipping fee: ${shippingFee}</p>
            )}
          </>
        ) : (
          <p className="text-gray-600">
            Please pick up your merchandise at the event you selected.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetails;
