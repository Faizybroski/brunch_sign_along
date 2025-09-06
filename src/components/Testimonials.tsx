
import React from 'react';
import { Button } from '@/components/ui/button';
import PartyPopper from '@/components/ui/party-popper';
import { Wine } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useContentData } from '@/hooks/useContentData';

const Testimonials = () => {
  const { testimonials, loading, error } = useContentData();

  if (loading) {
    return (
      <section id="testimonials" className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="font-dancing text-brunch-pink">Brunchers</span> Say</h2>
            <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="font-dancing text-brunch-pink">Brunchers</span> Say</h2>
            <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-red-600">
              Failed to load testimonials. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section id="testimonials" className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="font-dancing text-brunch-pink">Brunchers</span> Say</h2>
            <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              No testimonials available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="pt-12 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="font-dancing text-brunch-pink">Brunchers</span> Say</h2>
          <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Don't just take our word for it - hear from the people who have experienced the Brunch Singalong magic!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <div className="bg-brunch-light rounded-xl p-6 md:p-10 shadow-lg">
                    <div className="relative">
                      <svg
                        className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-brunch-yellow opacity-30"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104-6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      
                      <div className="relative">
                        <div className="md:flex items-center gap-6">
                          <div className="mb-6 md:mb-0 flex-shrink-0">
                            {testimonial.image_url ? (
                              <img 
                                src={testimonial.image_url}
                                alt={testimonial.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-brunch-pink border-4 border-white shadow-md mx-auto flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                  {testimonial.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <blockquote className="text-lg md:text-xl italic text-gray-700 mb-4">
                              "{testimonial.quote}"
                            </blockquote>
                            <div className="font-bold text-lg">{testimonial.name}</div>
                            <div className="text-brunch-orange">{testimonial.role}</div>
                            {testimonial.rating && (
                              <div className="flex mt-2">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-sm ${i < testimonial.rating ? 'text-brunch-yellow' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious 
                className="static translate-y-0 border-2 border-brunch-orange text-brunch-orange hover:bg-brunch-orange hover:text-white h-10 w-10 rounded-full" 
              />
              <CarouselNext 
                className="static translate-y-0 border-2 border-brunch-orange text-brunch-orange hover:bg-brunch-orange hover:text-white h-10 w-10 rounded-full" 
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
