
import React from 'react';
import { Utensils } from 'lucide-react';

interface FoodServiceDetailsProps {
  quantity: string;
  foodServicePrice: string;
}

const FoodServiceDetails: React.FC<FoodServiceDetailsProps> = ({ quantity, foodServicePrice }) => {
  return (
    <div className="flex items-start gap-4">
      <Utensils className="h-5 w-5 text-brunch-orange flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-semibold">Food Service Added</h3>
        <p className="text-gray-600">Buffet-style service included</p>
        <p className="text-gray-600">
          ${foodServicePrice} × {quantity} {parseInt(quantity) === 1 ? 'person' : 'people'}
        </p>
      </div>
    </div>
  );
};

export default FoodServiceDetails;
