
export interface OrderConfirmationRequest {
  orderId: string;
  email: string;
  total: string;
  subtotal: string;
  taxAndFees: string;
  quantity: string;
  
  // Optional fields depending on order type
  orderType?: 'ticket' | 'merchandise';
  
  // Ticket specific fields - required for ticket orders
  eventTitle?: string;
  eventDate?: string;
  ticketType?: string;
  ticketPrice?: string;
  includeFoodService?: boolean;
  foodServicePrice?: string;
  
  // Merchandise specific fields - required for merchandise orders
  itemName?: string;
  itemPrice?: string;
  deliveryMethod?: string;
  shippingFee?: string;
  address?: string;
}
