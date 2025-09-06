
import React from 'react';
import { Calendar } from 'lucide-react';

interface EventHeaderProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image?: string;
    image_url?: string;
    tiers?: {
      ga: any[];
      vip: any[];
      group?: any[];
    };
  };
  ticketType: string;
}

const EventHeader = ({ event, ticketType }: EventHeaderProps) => {
  const formatTicketType = (type: string) => {
    if (type === 'ga') return 'General Admission';
    if (type === 'vip') return 'VIP Experience';
    if (type === 'group') return 'Group Packages';
    return type;
  };

  return (
    <div className="relative w-full mb-8 mt-3">
      <div className="absolute inset-0 bg-gradient-to-r from-brunch-purple to-brunch-pink opacity-10"></div>
      
      <div className="relative px-6 py-3 rounded-xl">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-brunch-purple">
            <Calendar className="w-6 h-6" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brunch-purple to-brunch-pink">
              {event.date}
            </h1>
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-brunch-purple to-brunch-pink rounded-full"></div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {event.title}
          </h2>
          
          <h3 className="text-2xl font-medium text-gray-700">
            {formatTicketType(ticketType)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
