
import React from 'react';
import { Package } from 'lucide-react';

interface MerchandiseDetailsProps {
  itemName: string;
  quantity: string;
  itemPrice: string;
}

const MerchandiseDetails: React.FC<MerchandiseDetailsProps> = ({
  itemName,
  quantity,
  itemPrice
}) => {
  return (
    <div className="flex items-start gap-4">
      <Package className="h-5 w-5 text-brunch-orange flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-semibold">{itemName}</h3>
        <p className="text-gray-600">
          {quantity} {parseInt(quantity) === 1 ? 'item' : 'items'} purchased
        </p>
        <p className="text-gray-600 font-medium mt-1">
          ${parseFloat(itemPrice).toFixed(2)} per item
        </p>
      </div>
    </div>
  );
};

export default MerchandiseDetails;
