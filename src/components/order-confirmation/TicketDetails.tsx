
import React from 'react';
import { CalendarCheck } from 'lucide-react';

interface TicketDetailsProps {
  eventTitle: string;
  eventDate: string;
  quantity: string;
  ticketType: string;
  ticketPrice: string;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  eventTitle,
  eventDate,
  quantity,
  ticketType,
  ticketPrice
}) => {
  return (
    <div className="flex items-start gap-4">
      <CalendarCheck className="h-5 w-5 text-brunch-orange flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-semibold">{eventTitle}</h3>
        <p className="text-gray-600">{eventDate}</p>
        <p className="text-gray-600">
          {quantity} {parseInt(quantity) === 1 ? 'ticket' : 'tickets'} purchased
        </p>
        <p className="text-gray-600 font-medium mt-1">
          {ticketType} Ticket - ${parseFloat(ticketPrice).toFixed(2)} per ticket
        </p>
      </div>
    </div>
  );
};

export default TicketDetails;
