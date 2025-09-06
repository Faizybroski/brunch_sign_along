
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
  paymentStatus: string;
  tickets?: {
    eventTitle: string;
    eventDate: string;
    ticketType: string;
    quantity: number;
    unitPrice: number;
    includeFoodService: boolean;
    foodServicePrice: number;
  }[];
  merchandise?: {
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export const useOrderData = (orderId: string) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId || orderId === 'N/A') {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching order data for:", orderId);
        
        // Fetch order with customer information
        const { data: orderInfo, error: orderError } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            order_date,
            payment_status,
            customers (
              name,
              email
            )
          `)
          .eq('id', orderId)
          .single();

        if (orderError) {
          console.error("Error fetching order:", orderError);
          setError("Failed to fetch order information");
          setIsLoading(false);
          return;
        }

        // Fetch ticket information
        const { data: ticketsInfo, error: ticketsError } = await supabase
          .from('event_tickets')
          .select(`
            event_id,
            ticket_type,
            tier_title,
            quantity,
            unit_price,
            includes_food_service,
            food_service_price,
            events (
              title,
              date
            )
          `)
          .eq('order_id', orderId);

        if (ticketsError) {
          console.error("Error fetching tickets:", ticketsError);
        }

        // Fetch merchandise information
        const { data: merchandiseInfo, error: merchandiseError } = await supabase
          .from('merchandise_purchases')
          .select(`
            merchandise_item,
            quantity,
            unit_price
          `)
          .eq('order_id', orderId);

        if (merchandiseError) {
          console.error("Error fetching merchandise:", merchandiseError);
        }

        // Construct order data
        const formattedOrderData: OrderData = {
          orderId: orderInfo.id,
          customerName: orderInfo.customers?.name || 'Unknown',
          customerEmail: orderInfo.customers?.email || '',
          totalAmount: orderInfo.total_amount,
          orderDate: orderInfo.order_date,
          paymentStatus: orderInfo.payment_status,
          tickets: ticketsInfo?.map(ticket => ({
            eventTitle: ticket.events?.title || 'Event',
            eventDate: ticket.events?.date || '',
            ticketType: ticket.ticket_type,
            quantity: ticket.quantity,
            unitPrice: ticket.unit_price,
            includeFoodService: ticket.includes_food_service,
            foodServicePrice: ticket.food_service_price || 0
          })) || [],
          merchandise: merchandiseInfo?.map(item => ({
            itemName: item.merchandise_item,
            quantity: item.quantity,
            unitPrice: item.unit_price
          })) || []
        };

        setOrderData(formattedOrderData);
        console.log("Order data fetched successfully:", formattedOrderData);
      } catch (err) {
        console.error("Unexpected error fetching order data:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  return { orderData, isLoading, error };
};
