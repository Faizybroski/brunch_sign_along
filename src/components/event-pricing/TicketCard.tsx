
import React from 'react';
import { AlertOctagon, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TicketCardProps {
  tier: any;
  ticketType: string;
  quantity: number;
  onQuantityChange: (increment: boolean) => void;
  onBookNow: () => void;
}

const TicketCard = ({ tier, ticketType, quantity, onQuantityChange, onBookNow }: TicketCardProps) => {
  return (
    <Card 
      className={`border-2 ${
        tier.primary ? 'border-brunch-purple shadow-xl relative' : ''
      } ${
        tier.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-brunch-purple transition-all duration-300'
      } ${
        tier.soldOut ? 'opacity-40 grayscale cursor-not-allowed' : ''
      }`}
    >
      {ticketType !== 'group' && tier.primary && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brunch-purple text-white px-4 py-1 rounded-full text-sm">
          CURRENT TIER
        </div>
      )}
      {!tier.primary && !tier.disabled && !tier.soldOut && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full text-sm">
          UPCOMING TIER
        </div>
      )}
      {tier.soldOut && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm">
          SOLD OUT
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          {tier.title}
        </CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-brunch-purple">${tier.price}</span>
              {tier.soldOut && (
                <span className="text-sm text-destructive font-bold flex items-center gap-1">
                  <AlertOctagon className="h-4 w-4" /> SOLD OUT
                </span>
              )}
            </div>
            {!tier.disabled && !tier.soldOut && (
              <div className="text-sm text-gray-600 mt-1">
                {tier.ticketsLeft} tickets remaining
              </div>
            )}
          </div>
          {!tier.disabled && !tier.soldOut && (
            <div className="flex items-center border rounded-md">
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-r-none"
                onClick={() => onQuantityChange(false)}
                disabled={!quantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-l-none"
                onClick={() => onQuantityChange(true)}
                disabled={tier.ticketsLeft && quantity >= tier.ticketsLeft}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Button 
          className={`w-full ${
            tier.soldOut 
              ? 'bg-red-500 text-white hover:bg-red-600 mb-0.5' 
              : tier.disabled 
                ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' 
                : 'bg-brunch-purple hover:bg-brunch-purple-dark'
          } mt-3 ${tier.soldOut ? 'mb-0.5' : 'mb-3'}`} 
          onClick={onBookNow}
          disabled={tier.disabled || tier.soldOut || tier.ticketsLeft < 1}
        >
          {tier.soldOut 
            ? 'Sold Out' 
            : tier.disabled 
              ? 'Coming Soon'
              : tier.ticketsLeft < 1
                ? 'Sold Out'
                : ticketType === 'group' 
                  ? 'Book Package' 
                  : 'Book Now'
          }
        </Button>
        
        {/* Conditionally render features list */}
        {!tier.soldOut && (
          <ul className="space-y-1 text-sm">
            {tier.features.map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 text-brunch-purple flex items-center justify-center">
                  ✓
                </div>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketCard;
