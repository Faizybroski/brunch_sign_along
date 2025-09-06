
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, ArrowRight, Gift, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Hardcoded merchandise items with absolute image paths
const merchandiseItems = [
  {
    id: "necklace",
    name: "Heart Of The Ocean Necklace",
    image: "/lovable-uploads/c87609a8-1047-4f60-b03a-bb078be8184f.png"
  },
  {
    id: "mimosa-fan",
    name: "My Mimosa Will Go On Clack-Fan",
    image: "/lovable-uploads/2d64491f-97e8-479b-9a6b-ca2212a209a0.png"
  },
  {
    id: "brunch-fan",
    name: "Power Of Brunch Clack-Fan",
    image: "/lovable-uploads/4ac90e06-2b23-4657-b155-0f30c44a438f.png"
  }
];

interface MerchandiseCouponCardProps {
  orderId: string;
  eventId?: string;
}

const MerchandiseCouponCard: React.FC<MerchandiseCouponCardProps> = ({ orderId, eventId }) => {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationFrameIdRef = useRef<number | null>(null);
  
  // Check if all images are loaded
  useEffect(() => {
    const allLoaded = Object.keys(imagesLoaded).length === merchandiseItems.length && 
      Object.values(imagesLoaded).every(loaded => loaded);
    
    setAllImagesLoaded(allLoaded);
  }, [imagesLoaded]);
  
  // Preload images
  useEffect(() => {
    merchandiseItems.forEach(item => {
      const img = new Image();
      img.src = item.image;
      img.onload = () => {
        setImagesLoaded(prev => ({...prev, [item.id]: true}));
      };
      img.onerror = () => {
        console.error(`Failed to load image for ${item.id}. Path: ${item.image}`);
        setImagesLoaded(prev => ({...prev, [item.id]: true})); // Mark as loaded to not block
      };
    });
  }, []);
  
  // Enhanced autoplay effect with proper API usage and performance optimization
  useEffect(() => {
    if (!api || !allImagesLoaded) return;
    
    let lastScrollTime = 0;
    const interval = 2000; // 2 seconds interval
    
    const scrollNext = (timestamp: number) => {
      if (timestamp - lastScrollTime >= interval) {
        api.scrollNext();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % merchandiseItems.length);
        lastScrollTime = timestamp;
      }
      
      animationFrameIdRef.current = requestAnimationFrame(scrollNext);
    };
    
    animationFrameIdRef.current = requestAnimationFrame(scrollNext);
    
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [api, allImagesLoaded]);

  const handleRedeemCoupon = () => {
    // Set coupon details in localStorage
    localStorage.setItem('merchandise_coupon', JSON.stringify({
      code: `TICKET-${orderId.slice(0, 8).toUpperCase()}`,
      discount: 5,
      minPurchase: 30,
      orderId,
      expiry: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
    }));

    // Navigate to merchandise purchase page with coupon applied
    const params = new URLSearchParams({
      couponApplied: 'true',
      ...(eventId ? { eventId } : {})
    });
    
    toast.success("$5 discount coupon applied!", {
      description: "Discount will be applied at checkout with purchase of $30 or more."
    });
    
    navigate(`/merchandise?${params.toString()}`);
  };

  // Track image load status
  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({...prev, [id]: true}));
  };

  return (
    <Card className="overflow-hidden relative mt-6 mb-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-brunch-purple/30">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brunch-purple-light via-brunch-pink-light to-brunch-purple-light bg-size-200 animate-gradient-x z-0"></div>
      
      {/* Special offer badge with animation */}
      <div className="absolute top-0 right-0 bg-gradient-to-r from-brunch-accent to-brunch-pink text-white px-3 py-1 rounded-bl text-xs font-bold flex items-center animate-pulse">
        <Tag className="h-3 w-3 mr-1" />
        SPECIAL OFFER
      </div>
      
      <CardContent className="pt-6 pb-3 px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* White box with reduced height */}
          <div className="mb-3 md:mb-0 md:mr-6 md:flex-shrink-0 bg-white/80 rounded-lg p-3 pb-0 shadow-md relative">
            {!allImagesLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-lg">
                <Loader2 className="h-6 w-6 text-brunch-purple animate-spin" />
              </div>
            )}
            <Carousel 
              className="w-52 h-52 mx-auto" 
              opts={{ loop: true, align: "center" }}
              setApi={setApi}
            >
              <CarouselContent>
                {merchandiseItems.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="flex items-center justify-center h-full">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className={`max-h-44 max-w-44 object-contain ${
                          item.id.includes('fan') ? 'scale-110' : ''
                        }`}
                        loading="lazy"
                        width="176"
                        height="176"
                        onLoad={() => handleImageLoad(item.id)}
                        onError={() => handleImageLoad(item.id)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Gift className="h-5 w-5 text-brunch-pink animate-bounce" />
              <h3 className="text-lg sm:text-xl font-bold">
                <span className="font-dancing text-3xl sm:text-4xl relative inline-block">
                  <span className="text-brunch-orange font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">$5 OFF</span>
                </span>{" "}
                <span className="bg-gradient-to-r from-brunch-purple via-brunch-pink to-brunch-accent bg-clip-text text-transparent">
                  Merchandise
                </span>
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Enjoy $5 off official merchandise.
            </p>
            
            <Button 
              onClick={handleRedeemCoupon}
              className="bg-gradient-to-r from-brunch-purple to-brunch-accent hover:opacity-90 text-white w-full md:w-auto transform transition-transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Shop Merchandise <ArrowRight className="ml-1 h-4 w-4 animate-pulse" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchandiseCouponCard;
