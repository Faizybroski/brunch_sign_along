import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useEventData } from '@/hooks/useEventData';
import EventCard from './events/EventCard';
import MusicalJourneySection from './events/MusicalJourneySection';
import { useConfetti } from './events/useConfetti';
import { Wine, Martini } from 'lucide-react';
import PartyPopper from '@/components/ui/party-popper';

const MemoizedEventCard = React.memo(EventCard);

const Events = () => {
  const { data: events, isLoading, error } = useEventData();
  const { showConfetti, windowSize } = useConfetti();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('events');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
      observer.disconnect();
    };
  }, []);

  if (isLoading) return <div className="py-20 text-center">Loading events...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error loading events: {error.message || String(error)}</div>;

  // Ensure events is always an array
  const eventsArray = Array.isArray(events) ? events : [];

  return (
    <section id="events" className="py-10 bg-brunch-light">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          recycle={false}
          colors={['#9b87f5', '#FF1493', '#D946EF', '#7E69AB']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      <div className="container mx-auto px-4">
        <MusicalJourneySection />

        <div id="upcoming-events" className="text-center mb-8 mt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming <span className="font-dancing text-brunch-pink">Events</span>
          </h2>
          <div className="w-20 h-1 bg-brunch-pink mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6">
            Get ready to sing and celebrate!<br />
            Reserve your brunch experience today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {eventsArray.map((event) => (
            <MemoizedEventCard key={event.id} {...event} />
          ))}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every <span className="font-dancing text-brunch-purple">Brunch</span> Experience{' '}
            <span className="font-dancing text-brunch-pink">Includes</span>
          </h2>
          <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg text-center min-h-[140px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src="/lovable-uploads/a77a0ea3-e24a-4b21-b4e8-12dd76ff281d.png"
                  alt="Microphone"
                  className="h-16 w-auto transform -rotate-12 hover:rotate-0 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="mt-auto text-gray-600 pt-2">Free Inflatable Microphone</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center min-h-[140px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-3xl font-bold text-brunch-pink">40+</div>
              </div>
              <div className="mt-auto text-gray-600 pt-2">Songs per Event</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center min-h-[140px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-1 flex items-center justify-center">
                <Martini className="h-16 w-16 text-brunch-yellow transform -rotate-12 hover:rotate-0 transition-transform duration-300" />
              </div>
              <div className="mt-auto text-gray-600 pt-2">Welcome Mimosa</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center min-h-[140px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-3xl font-bold text-brunch-blue">4.9</div>
              </div>
              <div className="mt-auto text-gray-600 pt-2">Average Rating</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center min-h-[140px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-1 flex items-center justify-center">
                <PartyPopper className="h-16 w-16 text-brunch-pink transform -rotate-12 hover:rotate-0 transition-transform duration-300" />
              </div>
              <div className="mt-auto text-gray-600 pt-2">Confetti Poppers</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center min-h-[140px] flex flex-col items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-1 flex items-center justify-center">
                <Wine className="h-16 w-16 text-brunch-purple transform -rotate-12 hover:rotate-0 transition-transform duration-300" />
              </div>
              <div className="mt-auto text-gray-600 pt-2">Full Bar Service</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
