
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  type: 'ticket' | 'merchandise' | 'food_service';
  event_title?: string;
  name?: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tier?: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  order_date: string;
  total_amount: number;
  payment_status: string;
  items: OrderItem[];
}

export const useOrdersData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch orders with customer information
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name, email)
        `)
        .order('order_date', { ascending: false });

      if (ordersError) throw ordersError;

      // For each order, fetch the related items (tickets and merchandise)
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const items: OrderItem[] = [];

          // Fetch event tickets for this order
          const { data: tickets } = await supabase
            .from('event_tickets')
            .select(`
              *,
              events (title)
            `)
            .eq('order_id', order.id);

          if (tickets) {
            tickets.forEach(ticket => {
              items.push({
                type: 'ticket',
                event_title: ticket.events?.title || 'Unknown Event',
                quantity: ticket.quantity,
                unit_price: ticket.unit_price,
                tier: ticket.tier_title
              });

              // Add food service if included
              if (ticket.includes_food_service) {
                items.push({
                  type: 'food_service',
                  description: 'Food Service',
                  quantity: ticket.quantity,
                  unit_price: ticket.food_service_price || 0
                });
              }
            });
          }

          // Fetch merchandise purchases for this order
          const { data: merchandise } = await supabase
            .from('merchandise_purchases')
            .select('*')
            .eq('order_id', order.id);

          if (merchandise) {
            merchandise.forEach(item => {
              items.push({
                type: 'merchandise',
                name: item.merchandise_item,
                quantity: item.quantity,
                unit_price: item.unit_price,
                size: item.size,
                color: item.color
              });
            });
          }

          return {
            id: order.id,
            customer: {
              name: order.customers?.name || 'Unknown Customer',
              email: order.customers?.email || 'No email'
            },
            order_date: order.order_date,
            total_amount: order.total_amount,
            payment_status: order.payment_status,
            items
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders
  };
};
