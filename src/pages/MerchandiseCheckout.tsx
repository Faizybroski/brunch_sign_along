
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMerchandiseContext } from '@/hooks/useMerchandiseContext';
import { useMerchandiseCheckout } from '@/hooks/useMerchandiseCheckout';
import MerchandiseOrderSummary from '@/components/checkout/MerchandiseOrderSummary';
import MerchandiseCheckoutForm from '@/components/checkout/MerchandiseCheckoutForm';
import MerchandiseSelectionModal from '@/components/merchandise/MerchandiseSelectionModal';
import { MerchandiseItem } from '@/types/merchandise';
import { getActiveMerchandiseCoupon, applyCouponDiscount } from '@/utils/couponUtils';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tag } from 'lucide-react';

const MerchandiseCheckout = () => {
  const [searchParams] = useSearchParams();
  const { openModal } = useMerchandiseContext();
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check if a coupon was applied via URL parameter
  const couponApplied = searchParams.get('couponApplied') === 'true';
  
  // Initial item from URL params
  const itemId = searchParams.get('itemId') || '';
  const name = searchParams.get('name') || '';
  const price = parseFloat(searchParams.get('price') || '0');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const deliveryMethod = searchParams.get('deliveryMethod') || 'pickup';
  const eventId = searchParams.get('eventId') || '';
  const image = searchParams.get('image') || '';

  // State to track multiple items in cart
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>>([
    {
      id: itemId,
      name,
      price,
      quantity,
      image
    }
  ]);

  // Calculate costs
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'ship' ? 5 : 0;
  
  // Apply coupon if available
  const { discountApplied, discountAmount, finalTotal, coupon } = applyCouponDiscount(subtotal);
  const tax = finalTotal * 0.07; // 7% tax
  const total = finalTotal + shippingFee + tax;

  // Show coupon toast if applied through URL
  useEffect(() => {
    if (couponApplied && coupon) {
      toast.success(`$${coupon.discount} coupon applied!`, {
        description: `Minimum purchase: $${coupon.minPurchase}. Valid for orders of $${coupon.minPurchase} or more.`
      });
    }
  }, [couponApplied, coupon]);

  // Hook for handling checkout
  const { isSubmitting, handleSubmit } = useMerchandiseCheckout({
    items: cartItems,
    deliveryMethod,
    eventId,
    total,
    subtotal: finalTotal, // Pass the discounted subtotal
    tax,
    shippingFee,
    couponApplied: discountApplied,
    couponDiscount: discountAmount
  });

  // Available merchandise items
  const merchandiseItems = [
    {
      id: 1,
      name: "Heart Of The Ocean Necklace",
      image: "/lovable-uploads/c87609a8-1047-4f60-b03a-bb078be8184f.png",
      price: "$20",
      description: "Take home this iconic necklace today"
    },
    {
      id: 2,
      name: "My Mimosa Will Go On Clack-Fan",
      image: "/lovable-uploads/2d64491f-97e8-479b-9a6b-ca2212a209a0.png",
      price: "$20",
      description: "Stay cool with our signature pink fan"
    },
    {
      id: 3,
      name: "Power Of Brunch Clack-Fan",
      image: "/lovable-uploads/4ac90e06-2b23-4657-b155-0f30c44a438f.png",
      price: "$20",
      description: "Express your brunch power with our purple fan"
    }
  ];
  
  // For handling adding merchandise to cart
  const handleAddMoreMerch = () => {
    setSelectionModalOpen(true);
  };

  // Handle adding a new item to cart
  const handleAddItemToCart = (item: MerchandiseItem) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id.toString()
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          id: item.id.toString(),
          name: item.name,
          price: price,
          quantity: 1,
          image: item.image
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-brunch-light">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Merchandise Checkout</h1>
          
          {/* Show coupon info if applied */}
          {discountApplied && subtotal >= coupon?.minPurchase && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Tag className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                ${discountAmount} discount applied with coupon: {coupon.code}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Show minimum purchase requirement if not met */}
          {coupon && subtotal < coupon.minPurchase && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <Tag className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Add ${(coupon.minPurchase - subtotal).toFixed(2)} more to your cart to apply your ${coupon.discount} coupon.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Order Summary - First column */}
            <div className="md:col-span-1 order-first">
              <MerchandiseOrderSummary 
                cartItems={cartItems}
                shippingFee={shippingFee}
                tax={tax}
                total={total}
                deliveryMethod={deliveryMethod}
                eventId={eventId}
                onAddMoreMerch={handleAddMoreMerch}
                discountApplied={discountApplied}
                discountAmount={discountAmount}
                subtotal={subtotal}
                finalSubtotal={finalTotal}
              />
            </div>
            
            {/* Checkout Form - Second column */}
            <div className="md:col-span-2">
              <MerchandiseCheckoutForm 
                deliveryMethod={deliveryMethod}
                total={total}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Merchandise Selection Modal */}
          <MerchandiseSelectionModal 
            open={selectionModalOpen}
            onOpenChange={setSelectionModalOpen}
            items={merchandiseItems}
            currentItems={cartItems.map(item => ({
              id: parseInt(item.id),
              name: item.name,
              price: `$${item.price}`,
              description: "",
              image: item.image
            }))}
            onAddItem={handleAddItemToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default MerchandiseCheckout;
