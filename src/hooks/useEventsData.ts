
import { useMemo } from 'react';

export const useEventsData = (ticketType: string | null) => {
  const events = useMemo(() => [
    {
      id: 1,
      title: "Edition Céline",
      date: "May 24, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      currentPrice: ticketType === 'vip' ? '$55' : '$39',
      currentTier: "Second Release",
      ticketsLeft: 0, // Set to 0 to mark as sold out
      soldOut: true, // Add explicit soldOut flag
      soldOutTiers: ["First Release", "Second Release"], // Update sold out tiers
      spots: "Food Service 12:30 PM - 2:00 PM"
    },
    {
      id: 2,
      title: "Edition Céline",
      date: "May 31, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      currentPrice: ticketType === 'vip' ? '$49' : '$34',
      currentTier: "First Release",
      ticketsLeft: ticketType === 'vip' ? 25 : 25,
      spots: "Food Service 12:30 PM - 2:00 PM"
    },
    {
      id: 3,
      title: "Edition Céline",
      date: "June 7, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      currentPrice: ticketType === 'vip' ? '$49' : '$34',
      currentTier: "First Release",
      ticketsLeft: ticketType === 'vip' ? 15 : 15,
      spots: "Food Service 12:30 PM - 2:00 PM"
    },
    {
      id: 4,
      title: "Edition Céline",
      date: "June 14, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      currentPrice: ticketType === 'vip' ? '$49' : '$34',
      currentTier: "First Release",
      ticketsLeft: ticketType === 'vip' ? 20 : 30, 
      spots: "Food Service 12:30 PM - 2:00 PM"
    },
    {
      id: 5,
      title: "Edition Céline",
      date: "June 21, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      currentPrice: ticketType === 'vip' ? '$49' : '$34',
      currentTier: "First Release",
      ticketsLeft: ticketType === 'vip' ? 25 : 35,
      spots: "Food Service 12:30 PM - 2:00 PM"
    }
  ], [ticketType]);

  const getStartingPrice = () => {
    switch(ticketType) {
      case 'vip':
        return '$49';
      case 'group':
        return '$499';
      default:
        return '$34';
    }
  };

  return { events, getStartingPrice };
};
