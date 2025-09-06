
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Tag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface MerchandiseOrderSummaryProps {
  cartItems: CartItem[];
  shippingFee: number;
  tax: number;
  total: number;
  deliveryMethod: string;
  eventId: string;
  onAddMoreMerch: () => void;
  discountApplied?: boolean;
  discountAmount?: number;
  subtotal: number;
  finalSubtotal: number;
}

const MerchandiseOrderSummary: React.FC<MerchandiseOrderSummaryProps> = ({
  cartItems,
  shippingFee,
  tax,
  total,
  deliveryMethod,
  eventId,
  onAddMoreMerch,
  discountApplied = false,
  discountAmount = 0,
  subtotal,
  finalSubtotal
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex mb-4 border-b pb-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-contain mr-4" 
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discountApplied && discountAmount > 0 && (
                <div className="flex justify-between mt-2 text-green-600">
                  <span className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    Coupon Discount
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {deliveryMethod === 'ship' && (
                <div className="flex justify-between mt-2">
                  <span>Shipping</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between mt-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mt-4 pt-2 border-t font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-4 text-sm">
              <div className="flex items-center mb-2">
                <span className="font-medium">Delivery Method:</span>
                <span className="ml-2 text-gray-600">
                  {deliveryMethod === 'ship' ? 'Ship to address' : 'Pick up at event'}
                </span>
              </div>
              
              {deliveryMethod === 'pickup' && eventId && (
                <p className="text-gray-600">
                  You'll pick up your merchandise at the event you selected.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add more merch button */}
      <Button 
        onClick={onAddMoreMerch}
        className="w-full mt-4 bg-brunch-purple hover:bg-brunch-pink text-white"
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        Add More Merchandise
      </Button>
    </div>
  );
};

export default MerchandiseOrderSummary;
