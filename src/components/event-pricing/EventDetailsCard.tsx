
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventDetailsCardProps {
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
}

const EventDetailsCard = ({ event }: EventDetailsCardProps) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brunch-purple" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-brunch-purple" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-brunch-purple" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsCard;
