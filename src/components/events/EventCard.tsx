import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  city: string;
  image_url: string;
  soldOut?: boolean;
}

const EventCard = ({ id, title, date, time, city, image_url, soldOut }: EventCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Event card image failed to load, using placeholder");
    e.currentTarget.src = '/placeholder.svg';
  };

  // Prepare WebP version of the image URL if it's from lovable-uploads
  const getOptimizedImageUrl = (url: string) => {
    if (url.includes('lovable-uploads')) {
      // Keep original as fallback for browsers that don't support WebP
      return url;
    }
    return url;
  };

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 ${soldOut ? 'relative' : ''}`}>
      {soldOut && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-red-600 text-white py-2 px-4 rounded-lg transform rotate-12 font-bold flex items-center gap-2">
            <AlertOctagon className="h-5 w-5" />
            SOLD OUT
          </div>
        </div>
      )}
      
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getOptimizedImageUrl(image_url)} 
          alt={title}
          className={`w-full h-full object-cover ${soldOut ? 'opacity-70 grayscale' : ''}`}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          width="400"
          height="192"
        />
        <div className="absolute top-4 right-4 bg-brunch-pink text-white text-xs font-bold px-3 py-1 rounded-full">
          Join Us!
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
        
        <div className="mb-4 flex items-center justify-center bg-brunch-purple/10 rounded-lg p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-brunch-purple mb-1">
              {format(new Date(date), 'MMMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-600">{time}</div>
            <div className="text-sm font-bold text-brunch-pink mt-1">{city}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button 
            className={`w-full ${soldOut ? 'bg-red-600 hover:bg-red-700' : 'bg-brunch-pink hover:bg-brunch-purple'} text-white transition-colors`}
            asChild
            disabled={soldOut}
          >
            <Link to={soldOut ? '#' : `/select-tickets/${id}`}>
              {soldOut ? 'Sold Out' : 'Book Now'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
