
import React from 'react';
import { Calendar, User, MapPin, Clock } from 'lucide-react';

interface EventHeaderProps {
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const EventHeader = ({ image, title, date, time, location }: EventHeaderProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Event header image failed to load, using placeholder");
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="relative">
      {/* Background image with overlay - critical for initial view so load eagerly */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="eager" 
          fetchPriority="high"
          width="1200"
          height="320"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brunch-purple/80 to-brunch-pink/70"></div>
      </div>

      {/* Event details */}
      <div className="container mx-auto px-4 relative -mt-16 z-10">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-brunch-purple" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-brunch-purple" />
              <span>{time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-brunch-purple" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
