
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TicketTypeButtons from '@/components/events/TicketTypeButtons';
import EventSelectionCard from '@/components/events/EventSelectionCard';
import { useEventData } from '@/hooks/useEventData';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticketType = searchParams.get('type');
  const selectedEventDate = searchParams.get('date');
  
  // Use the existing useEventData hook to fetch events dynamically
  const { data: events, isLoading, error } = useEventData();

  useEffect(() => {
    if (selectedEventDate && ticketType) {
      navigate(`/pricing/${selectedEventDate}?type=${ticketType}`);
    }
  }, [selectedEventDate, ticketType, navigate]);

  const getStartingPrice = () => {
    switch(ticketType) {
      case 'vip':
        return '$49';
      case 'group':
        return '$499';
      default:
        return '$34';
    }
  };

  // Transform the events data to match the expected format
  const transformedEvents = React.useMemo(() => {
    if (!events || !Array.isArray(events)) return [];
    
    return events.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date ? format(new Date(event.date), 'MMMM d, yyyy') : 'TBA',
      time: event.time,
      location: event.location,
      image: event.image_url,
      currentPrice: ticketType === 'vip' ? '$55' : '$39',
      currentTier: "Second Release",
      ticketsLeft: event.is_sold_out ? 0 : 25,
      soldOut: event.is_sold_out,
      soldOutTiers: event.is_sold_out ? ["First Release", "Second Release"] : [],
      spots: "Food Service 12:30 PM - 2:00 PM"
    }));
  }, [events, ticketType]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 md:py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-brunch-purple animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 md:py-20 bg-brunch-light">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-600">Error loading events: {error.message || String(error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-brunch-light">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
          {selectedEventDate ? 'Select Ticket Type' : 'Select Event Date'}
        </h1>
        
        <TicketTypeButtons 
          ticketType={ticketType} 
          selectedEventDate={selectedEventDate} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {transformedEvents.map((event) => (
            <EventSelectionCard 
              key={event.id} 
              {...event} 
              ticketType={ticketType}
              getStartingPrice={getStartingPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
