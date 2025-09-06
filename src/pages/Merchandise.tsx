
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Tag, Loader2 } from 'lucide-react';
import { getActiveMerchandiseCoupon } from '@/utils/couponUtils';
import { useDynamicMerchandise } from '@/hooks/useDynamicMerchandise';

const MerchandisePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const couponApplied = searchParams.get('couponApplied') === 'true';
  const eventId = searchParams.get('eventId') || '';
  
  // Use dynamic merchandise hook
  const { merchandiseItems, isLoading, error } = useDynamicMerchandise();
  
  // Check for coupon
  const coupon = getActiveMerchandiseCoupon();
  
  const handleBuyItem = (item: any) => {
    const params = new URLSearchParams({
      itemId: item.id.toString(),
      name: item.name,
      price: item.price.toString(),
      quantity: '1',
      image: item.image_url || '/placeholder.svg',
      deliveryMethod: 'pickup',
      ...(eventId ? { eventId } : {})
    });
    
    navigate(`/merchandise-checkout?${params.toString()}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-brunch-purple to-brunch-accent bg-clip-text text-transparent">
              Official Merchandise
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Take home a piece of the Brunch Singalong magic
            </p>
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-brunch-purple animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-brunch-purple to-brunch-accent bg-clip-text text-transparent">
              Official Merchandise
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Take home a piece of the Brunch Singalong magic
            </p>
            <div className="text-center py-20">
              <p className="text-red-600">Error loading merchandise: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no merchandise items available
  if (!merchandiseItems || merchandiseItems.length === 0) {
    return (
      <div className="min-h-screen py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-brunch-purple to-brunch-accent bg-clip-text text-transparent">
              Official Merchandise
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Take home a piece of the Brunch Singalong magic
            </p>
            <div className="text-center py-20">
              <p className="text-gray-600">No merchandise items available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-brunch-light">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-brunch-purple to-brunch-accent bg-clip-text text-transparent">
            Official Merchandise
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Take home a piece of the Brunch Singalong magic
          </p>

          {coupon && (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-700">
                      ${coupon.discount} off coupon applied
                    </p>
                    <p className="text-sm text-green-600">
                      Minimum purchase: ${coupon.minPurchase}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded">
                  {coupon.code}
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="grid md:grid-cols-3 gap-8">
            {merchandiseItems.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative pb-[100%]">
                  <img 
                    src={item.image_url || '/placeholder.svg'} 
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brunch-purple">${item.price.toFixed(2)}</span>
                    <Button 
                      onClick={() => handleBuyItem(item)}
                      className="bg-brunch-pink hover:bg-brunch-purple text-white"
                      disabled={item.inventory <= 0}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" /> 
                      {item.inventory <= 0 ? 'Out of Stock' : 'Buy Now'}
                    </Button>
                  </div>
                  {item.inventory <= 5 && item.inventory > 0 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Only {item.inventory} left in stock!
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchandisePage;
