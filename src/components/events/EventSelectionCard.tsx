
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventSelectionCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  currentPrice?: string;
  currentTier?: string;
  ticketsLeft?: number;
  soldOut?: boolean;
  soldOutTiers?: string[];
  spots: string;
  ticketType: string | null;
  getStartingPrice: () => string;
}

const EventSelectionCard = ({
  id,
  title,
  date,
  time,
  location,
  image,
  spots,
  ticketType,
  soldOut,
  ticketsLeft,
  getStartingPrice
}: EventSelectionCardProps) => {
  const navigate = useNavigate();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Event selection card image failed to load, using placeholder");
    e.currentTarget.src = '/placeholder.svg';
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
          src={image || '/placeholder.svg'} 
          alt={title}
          className={`w-full h-full object-cover ${soldOut ? 'opacity-70 grayscale' : ''}`}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          width="400" 
          height="192"
        />
        <div className="absolute top-4 right-4 bg-brunch-pink text-white text-xs font-bold px-3 py-1 rounded-full">
          {spots}
        </div>
        {ticketType === 'group' && (
          <div className="absolute bottom-4 right-4 bg-brunch-purple text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Users className="h-3 w-3" /> Group VIP Packages
          </div>
        )}
      </div>
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-center bg-brunch-orange/10 rounded-lg p-3">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-brunch-orange mb-1">{date}</div>
            <div className="text-xs md:text-sm text-gray-600">{time}</div>
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
        <div className="mb-4 flex items-center text-gray-600 text-xs md:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>
        <div className="mb-4">
          {!soldOut ? (
            <>
              <div className="text-brunch-orange font-bold text-base md:text-lg mb-1">
                Starting at {getStartingPrice()}
              </div>
              {ticketType === 'ga' && (
                <div className="text-xs md:text-sm text-gray-600">
                  Limited Seating - First Come, First Served
                </div>
              )}
              {ticketType === 'vip' && (
                <div className="text-xs md:text-sm text-gray-600">
                  Reserved VIP Seating
                </div>
              )}
              {ticketType === 'group' && (
                <div className="text-xs md:text-sm text-gray-600">
                  Reserved VIP Booth Seating
                </div>
              )}
            </>
          ) : (
            <div className="text-red-600 font-bold text-base md:text-lg mb-1 flex items-center gap-1">
              <AlertOctagon className="h-4 w-4" /> Sold Out
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button 
            variant="default"
            className={`w-full ${soldOut ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' : 'bg-brunch-purple hover:bg-brunch-pink'} text-white transition-colors font-semibold px-4 py-2 rounded-lg shadow-md`}
            onClick={() => navigate(`/pricing/${id}?type=${ticketType || 'ga'}`)}
            disabled={soldOut || currentPrice === "No tier found"}
          >
            {soldOut 
    ? "Sold Out" 
    : currentPrice === "$0" 
      ? "No tier found" 
      : `Select ${title}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventSelectionCard;
