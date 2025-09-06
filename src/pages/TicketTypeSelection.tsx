import React from 'react';
import { Button } from '@/components/ui/button';
import { Ticket, Crown, Users } from 'lucide-react';
import EventHeader from '@/components/ticket-selection/EventHeader';
import TicketTypeCard from '@/components/ticket-selection/TicketTypeCard';
import { supabase } from '@/integrations/supabase/client';
import { useTicketTypeSelection } from '@/hooks/useTicketTypeSelection';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';

const TicketTypeSelection = () => {
  const { eventId } = useParams();
  const { event, isLoading, error, handleSelectTicketType } = useTicketTypeSelection();
  // const [lowestPrice, setLowestPrice] = React.useState<string | null>(null);
    const [priceMap, setPriceMap] = React.useState<Record<string, number>>({});

const fetchLowestTierPrice = async () => {
    // Fetch lowest price per ticket type
const { data: rows, error } = await supabase
  .from("event_tier_inventory")
      .select("ticket_type, price")
    .eq("event_id", parseInt(eventId!, 10));

    
      if (error) {
        console.error("Grouping of type and tier price error: ", error);
      }
    const newPriceMap: Record<string, number> = {};
  rows?.forEach((row) => {
      let typeKey = row.ticket_type.toLowerCase();

  // Map database keys to frontend keys
  if (typeKey === "general") typeKey = "ga";
  if (typeKey === "vip") typeKey = "vip";
  if (typeKey === "premium") typeKey = "premium";

  if (!newPriceMap[typeKey] || row.price < newPriceMap[typeKey]) {
    newPriceMap[typeKey] = row.price;
  }
  });

  setPriceMap(newPriceMap);
  }

  React.useEffect(() => {
    if (eventId) {
      fetchLowestTierPrice();
    }
  }, [eventId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brunch-light flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Loading Event...</h1>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-brunch-light flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the event you're looking for.</p>
          <Button asChild>
            <Link to="/events">Return to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const ticketTypes = [
    {
      icon: Ticket,
      title: 'General Admission',
      price: priceMap["ga"] ? `$${priceMap["ga"]}` : "$0",
      features: [
        'Show Admission',
        'Inflatable Microphone',
        'Complimentary Mimosa',
        'Dance Floor Access',
        'Limited Seating - First Come, First Served'
      ],
      type: 'general'
    },
    {
      icon: Crown,
      title: 'VIP Experience',
      price: priceMap["vip"] ? `$${priceMap["vip"]}` : "$0",
      features: [
        'Show Admission',
        'Inflatable Microphone',
        'Complimentary Mimosa',
        'Dance Floor Access',
        'Reserved VIP Seating',
        'Confetti Popper'
      ],
      type: 'vip',
      isPrimary: true,
      isPopular: true
    },
    {
      icon: Users,
      title: 'Premium',
      price: priceMap["premium"] ? `$${priceMap["premium"]}` : "$0",
      features: [
        '10-25 VIP Admissions',
        '10-25 Inflatable Microphones',
        '10-25 Complimentary Mimosas',
        'Dance Floor Access',
        'Reserved VIP Booth Seating',
        '10-25 Confetti Poppers'
      ],
      type: 'premium'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brunch-purple-light to-brunch-light pb-20">
      <EventHeader 
        image={event.image || event.image_url || ''}
        title={event.title || ''} 
        date={event.date || ''} 
        time={event.time || ''} 
        location={event.location || ''} 
      />

      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Select Your Experience
        </h1>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {ticketTypes.map((ticket) => (
            <TicketTypeCard
              key={ticket.type}
              {...ticket}
              onClick={() => handleSelectTicketType(ticket.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketTypeSelection;
