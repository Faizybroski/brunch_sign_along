
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket } from 'lucide-react';
import QuantityAdjuster from './QuantityAdjuster';

interface EventDetailsProps {
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    image_url?: string;
  };
  quantity: number;
  ticketType: string;
  onQuantityChange: (newQuantity: number) => void;
}

const EventDetails = ({ 
  event, 
  quantity, 
  ticketType, 
  onQuantityChange 
}: EventDetailsProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Event details image failed to load, using placeholder");
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-4">Event Details</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <img 
            src={event.image || event.image_url || '/placeholder.svg'} 
            alt={event.title} 
            className="rounded-lg w-full md:w-1/4 h-32 object-cover"
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            width="300"
            height="128"
          />
          <div className="flex-grow">
            <h3 className="font-bold">{event.title}</h3>
            <p className="text-gray-600">{event.date} • {event.time}</p>
            <p className="text-gray-600">{event.location}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <Ticket className="h-4 w-4 mr-1 text-brunch-orange" />
                <span className="font-semibold text-brunch-orange">
                  {quantity} {quantity === 1 ? 'ticket' : 'tickets'} • {ticketType.toUpperCase()}
                </span>
              </div>
              <QuantityAdjuster
                quantity={quantity}
                onChange={onQuantityChange}
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
