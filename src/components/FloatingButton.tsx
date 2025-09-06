
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToEvents = () => {
    const upcomingEventsSection = document.getElementById('upcoming-events');
    if (upcomingEventsSection) {
      const headerOffset = 100; // Offset to show the section heading
      const elementPosition = upcomingEventsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToEvents}
      className="fixed bottom-6 right-6 z-50 bg-brunch-purple hover:bg-brunch-pink text-white shadow-lg transform hover:scale-105 transition-all duration-300 gap-2 md:text-lg py-6"
    >
      <Ticket className="w-5 h-5" />
      Buy Tickets
    </Button>
  );
};

export default FloatingButton;
