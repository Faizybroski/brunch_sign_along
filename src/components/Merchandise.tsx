
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMerchandiseContext } from '@/hooks/useMerchandiseContext';
import MerchandiseModal from '@/components/merchandise/MerchandiseModal';
import { Loader2 } from 'lucide-react';

const Merchandise = () => {
  const { isModalOpen, selectedItem, openModal, closeModal, merchandiseItems, isLoading } = useMerchandiseContext();
  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  
  // Check if all images are loaded
  useEffect(() => {
    if (merchandiseItems.length > 0 && 
        Object.keys(imagesLoaded).length === merchandiseItems.length && 
        Object.values(imagesLoaded).every(loaded => loaded)) {
      setAllImagesLoaded(true);
    }
  }, [imagesLoaded, merchandiseItems.length]);

  // Preload images
  useEffect(() => {
    if (merchandiseItems.length > 0) {
      merchandiseItems.forEach(item => {
        const img = new Image();
        img.src = item.image;
        img.onload = () => {
          setImagesLoaded(prev => ({...prev, [item.id]: true}));
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${item.image}`);
          setImagesLoaded(prev => ({...prev, [item.id]: true})); // Mark as loaded anyway to avoid blocking
        };
      });
    }
  }, [merchandiseItems]);
  
  // Add auto-rotation for the carousel with performance optimizations
  useEffect(() => {
    if (!api || !allImagesLoaded || merchandiseItems.length === 0) return;
    
    // Set up autoplay functionality with requestAnimationFrame for better performance
    let lastScrollTime = 0;
    const interval = 3000; // 3 seconds interval
    
    const scrollNext = (timestamp: number) => {
      if (timestamp - lastScrollTime >= interval) {
        api.scrollNext();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % merchandiseItems.length);
        lastScrollTime = timestamp;
      }
      
      // Only schedule animation frame if component is mounted
      animationFrameId = requestAnimationFrame(scrollNext);
    };
    
    let animationFrameId = requestAnimationFrame(scrollNext);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [api, allImagesLoaded, merchandiseItems.length]);

  const handleImageLoad = (id: number) => {
    setImagesLoaded(prev => ({...prev, [id]: true}));
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <section className="py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Official <span className="font-dancing text-brunch-pink">Merchandise</span></h2>
            <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Take a piece of the Brunch Singalong magic home with our exclusive merchandise collection!
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-brunch-purple animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Show message if no merchandise items available
  if (!merchandiseItems || merchandiseItems.length === 0) {
    return (
      <section className="py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Official <span className="font-dancing text-brunch-pink">Merchandise</span></h2>
            <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Take a piece of the Brunch Singalong magic home with our exclusive merchandise collection!
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-600">No merchandise items available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-brunch-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Official <span className="font-dancing text-brunch-pink">Merchandise</span></h2>
          <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Take a piece of the Brunch Singalong magic home with our exclusive merchandise collection!
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {!allImagesLoaded && merchandiseItems.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
              <Loader2 className="h-8 w-8 text-brunch-purple animate-spin" />
            </div>
          )}
          
          <Carousel
            opts={{
              align: "center",
              loop: true,
              dragFree: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {merchandiseItems.map((item) => (
                <CarouselItem key={item.id} className="md:basis-3/4 lg:basis-2/3">
                  <div className="bg-white rounded-xl p-6 shadow-lg transition-transform hover:scale-105 h-full flex flex-col">
                    <div className="mb-6 h-48 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-contain"
                        loading="lazy"
                        onLoad={() => handleImageLoad(item.id)}
                        onError={() => handleImageLoad(item.id)}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-brunch-purple font-bold">{item.price}</span>
                        <Button 
                          className="bg-brunch-pink hover:bg-brunch-purple"
                          onClick={() => openModal(item)}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex items-center justify-between absolute w-full top-1/2 -translate-y-1/2 px-2 md:px-4 z-10 pointer-events-none">
              <div className="pointer-events-auto">
                <CarouselPrevious className="h-10 w-10 rounded-full border-2 border-brunch-purple bg-white hover:bg-brunch-purple hover:text-white transition-all duration-300 hover:scale-110" />
              </div>
              <div className="pointer-events-auto">
                <CarouselNext className="h-10 w-10 rounded-full border-2 border-brunch-purple bg-white hover:bg-brunch-purple hover:text-white transition-all duration-300 hover:scale-110" />
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-6 mb-4 md:hidden">
              <CarouselPrevious className="h-8 w-8 static ml-0 rounded-full border-2 border-brunch-purple bg-white hover:bg-brunch-purple hover:text-white transition-all duration-300 hover:scale-110" />
              <CarouselNext className="h-8 w-8 static ml-0 rounded-full border-2 border-brunch-purple bg-white hover:bg-brunch-purple hover:text-white transition-all duration-300 hover:scale-110" />
            </div>
          </Carousel>
        </div>
        
        <MerchandiseModal 
          open={isModalOpen} 
          onOpenChange={(open) => {
            if (!open) closeModal();
          }} 
          item={selectedItem} 
        />
      </div>
    </section>
  );
};

export default Merchandise;
