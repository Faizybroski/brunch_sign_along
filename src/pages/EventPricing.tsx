
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { useEventData } from '@/hooks/useEventData';
import { useVIPPackages } from '@/hooks/useVIPPackages';
import EventHeader from '@/components/event-pricing/EventHeader';
import EventDetailsCard from '@/components/event-pricing/EventDetailsCard';
import TicketCard from '@/components/event-pricing/TicketCard';
import GroupPackageCard from '@/components/event-pricing/GroupPackageCard';
import FoodServiceSelection from '@/components/checkout/FoodServiceSelection';
import { foodServiceConfig } from '@/config/foodService';

const EventPricing = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ticketType = searchParams.get('type') || 'general';
  
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [includeFoodService, setIncludeFoodService] = useState(false);
  
  const { data: eventData, isLoading, error } = useEventData(eventId);
  const { data: vipPackages, isLoading: isLoadingVIP } = useVIPPackages(Number(eventId));
  
  useEffect(() => {
    if (error) {
      console.error("Error loading event data:", error);
      toast.error("Error loading event data");
    }
  }, [error]);

  useEffect(() => {
    if (vipPackages) {
      console.log('VIP packages available:', vipPackages);
    }
  }, [vipPackages]);
  
  if (isLoading || isLoadingVIP) {
    return (
      <div className="min-h-screen bg-brunch-light flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-brunch-purple animate-spin mb-4" />
        <p className="text-xl font-medium">Loading event details...</p>
      </div>
    );
  }
  
  if (!eventData) {
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

  const event = {
    id: Array.isArray(eventData) ? eventData[0]?.id : eventData.id,
    title: Array.isArray(eventData) ? eventData[0]?.title : eventData.title,
    date: Array.isArray(eventData) ? eventData[0]?.date : eventData.date,
    time: Array.isArray(eventData) ? eventData[0]?.time : eventData.time,
    location: Array.isArray(eventData) ? eventData[0]?.location : eventData.location,
    image_url: Array.isArray(eventData) 
      ? eventData[0]?.image_url 
      : (eventData.image_url || eventData.image),
    image: Array.isArray(eventData) 
      ? eventData[0]?.image_url 
      : (eventData.image || eventData.image_url),
    tiers: Array.isArray(eventData) 
      ? { general: [], vip: [], premium: [] } 
      : (eventData.tiers || { general: [], vip: [], premium: [] })
  };

  const adjustQuantity = (tierId: string, increment: boolean) => {
    setQuantities(prev => {
      const currentQty = prev[tierId] || 0;
      const newQty = increment ? currentQty + 1 : Math.max(0, currentQty - 1);
      return { ...prev, [tierId]: newQty };
    });
  };

  const handleBookNow = (tier: string) => {
    const quantity = quantities[tier] || 0;
    if (quantity === 0) {
      toast.error("Please select at least one ticket");
      return;
    }
    
    const foodServiceParams = includeFoodService 
      ? `&includeFoodService=true&foodServicePrice=${foodServiceConfig.price}` 
      : '';
    
    navigate(`/checkout/${eventId}?type=${ticketType}&tier=${tier}&quantity=${quantity}${foodServiceParams}`);
  };

  const getPricingTiers = () => {
    if (ticketType === 'group') {
      return [];
    }

    if (!event?.tiers) {
      console.log("No tiers data available");
      return [];
    }
    
    if (!event.tiers[ticketType as keyof typeof event.tiers]) {
      console.log(`No ${ticketType} tier data available`);
      return [];
    }
    return event.tiers[ticketType as keyof typeof event.tiers].map(tier => ({
      ...tier,
      soldOut: tier.ticketsLeft === 0
    }));
  };

  const tiers = getPricingTiers();

  return (
    <div className="min-h-screen py-16 bg-brunch-light">
      <div className="container mx-auto px-4">
        {/* Remove the back button and keep the event header */}
        <EventHeader event={event} ticketType={ticketType} />
        
        <div className="grid md:grid-cols-3 gap-8">
          {ticketType === 'group' ? (
            vipPackages && vipPackages.length > 0 ? (
              vipPackages.map((pkg) => (
                <GroupPackageCard
                  key={pkg.package_id}
                  pkg={pkg}
                  quantity={quantities[pkg.package_name] || 0}
                  onQuantityChange={(increment) => adjustQuantity(pkg.package_name, increment)}
                  onBookNow={() => handleBookNow(pkg.package_name)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Group Packages Available</h3>
                <p>There are currently no group packages available for this event.</p>
              </div>
            )
          ) : (
            <>
              {tiers.map((tier, index) => (
                <TicketCard
                  key={index}
                  tier={tier}
                  ticketType={ticketType}
                  quantity={quantities[tier.title] || 0}
                  onQuantityChange={(increment) => adjustQuantity(tier.title, increment)}
                  onBookNow={() => handleBookNow(tier.title)}
                />
              ))}
              
              {tiers.length > 0 && (
                <div className="md:col-span-3">
                  <FoodServiceSelection
                    form={null} // explicitly pass null to indicate standalone mode
                    foodServiceDescription={foodServiceConfig.description}
                    foodServicePrice={foodServiceConfig.price}
                    quantity={Object.values(quantities).reduce((a, b) => a + b, 0)}
                    includeFoodService={includeFoodService}
                    onToggleFoodService={(include) => setIncludeFoodService(include)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPricing;
