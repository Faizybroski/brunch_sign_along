
import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TicketAvailabilityInfoProps {
  available: boolean;
  soldOut: boolean;
  ticketsLeft?: number;
  disabled?: boolean;
}

const TicketAvailabilityInfo = ({ 
  available, 
  soldOut, 
  ticketsLeft, 
  disabled = false 
}: TicketAvailabilityInfoProps) => {
  if (soldOut) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center text-red-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">SOLD OUT</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This ticket tier is completely sold out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center text-gray-500">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">COMING SOON</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This tier will become available after earlier tiers sell out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (available && ticketsLeft && ticketsLeft <= 10) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center text-amber-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">LOW INVENTORY: {ticketsLeft} LEFT</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Only {ticketsLeft} tickets remaining in this tier!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (available) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center text-green-500">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">AVAILABLE</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{ticketsLeft || 'Multiple'} tickets available</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
};

export default TicketAvailabilityInfo;
