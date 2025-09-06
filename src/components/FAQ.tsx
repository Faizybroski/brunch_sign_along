
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useContentData } from '@/hooks/useContentData';

const FAQ = () => {
  const { faqs, loading, error } = useContentData();

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-brunch-purple relative mb-2">
                Frequently Asked
              </h2>
              <span className="font-dancing text-brunch-pink text-3xl md:text-4xl block mb-4">
                Questions
              </span>
              <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 h-1 bg-brunch-pink"></div>
            </div>
            <p className="text-gray-600">Loading frequently asked questions...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-brunch-purple relative mb-2">
                Frequently Asked
              </h2>
              <span className="font-dancing text-brunch-pink text-3xl md:text-4xl block mb-4">
                Questions
              </span>
              <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 h-1 bg-brunch-pink"></div>
            </div>
            <p className="text-red-600">Failed to load FAQs. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-brunch-purple relative mb-2">
                Frequently Asked
              </h2>
              <span className="font-dancing text-brunch-pink text-3xl md:text-4xl block mb-4">
                Questions
              </span>
              <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 h-1 bg-brunch-pink"></div>
            </div>
            <p className="text-gray-600">No FAQs available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-brunch-purple relative mb-2">
              Frequently Asked
            </h2>
            <span className="font-dancing text-brunch-pink text-3xl md:text-4xl block mb-4">
              Questions
            </span>
            <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 h-1 bg-brunch-pink"></div>
          </div>
          
          <div className="relative">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-2xl mx-auto"
            >
              <CarouselContent>
                {faqs.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-3/4 lg:basis-2/3">
                    <div className="bg-brunch-light rounded-xl p-6 h-full border-2 border-transparent hover:border-brunch-pink transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md mt-1 text-center">
                      <h3 className="text-xl font-semibold text-brunch-purple mb-4">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {item.answer}
                      </p>
                      {item.category && item.category !== 'general' && (
                        <span className="inline-block mt-4 px-3 py-1 bg-brunch-pink text-white text-sm rounded-full">
                          {item.category}
                        </span>
                      )}
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
        </div>
      </div>
    </section>
  );
};

export default FAQ;
