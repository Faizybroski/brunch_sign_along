
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image_url?: string;
  image?: string;
  inventory?: EventTierInventory[];
  city?: string;
}

export interface EventTierInventory {
  id: number;
  event_id: number;
  ticket_type: string;
  tier_title: string;
  initial_quantity: number;
  available_quantity: number;
  price: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TransformedEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  image_url?: string;
  city?: string;
  tiers: {
    general: TicketTier[];
    vip: TicketTier[];
    premium: TicketTier[];
  };
  foodService: {
    price: number;
    description: string;
  };
}

export interface TicketTier {
  title: string;
  description: string;
  price: string;
  ticketsLeft: number;
  primary: boolean;
  soldOut: boolean;
  disabled: boolean;
  features: string[];
}
