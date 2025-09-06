
import { TransformedEvent } from '@/hooks/types';

/**
 * Create specific mappings for known events to ensure consistency
 */
export const getEventMappings = (): Record<number, Partial<TransformedEvent>> => {
  return {
    1: {
      title: "Edition Céline",
      date: "May 24, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      image_url: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      city: "MONTREAL"
    },
    2: {
      title: "Edition Céline",
      date: "May 31, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      image_url: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      city: "MONTREAL"
    },
    3: {
      title: "Edition Céline",
      date: "June 7, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      image_url: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      city: "MONTREAL"
    },
    4: {
      title: "Edition Céline",
      date: "June 14, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      image_url: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      city: "MONTREAL"
    },
    5: {
      title: "Edition Céline",
      date: "June 21, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "1171 St Catherine St E, Montreal",
      image: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      image_url: "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      city: "MONTREAL"
    },
    6: {
      title: "Stampede Edition",
      date: "July 5, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Ranchmans Bar",
      city: "CALGARY",
      image: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png",
      image_url: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png"
    },
    7: {
      title: "Stampede Edition",
      date: "July 6, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Ranchmans Bar",
      city: "CALGARY",
      image: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png",
      image_url: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png"
    },
    8: {
      title: "Stampede Edition",
      date: "July 12, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Ranchmans Bar",
      city: "CALGARY",
      image: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png",
      image_url: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png"
    },
    9: {
      title: "Stampede Edition",
      date: "July 13, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Ranchmans Bar",
      city: "CALGARY",
      image: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png",
      image_url: "/lovable-uploads/d9f595ad-8094-4535-8bef-12b9797e7249.png"
    }
  };
};

/**
 * Default event details to use when data is missing
 */
export const getDefaultEventDetails = () => {
  return {
    date: "Upcoming",
    time: "2:00 PM - 4:00 PM",
    location: "Venue TBA"
  };
};
