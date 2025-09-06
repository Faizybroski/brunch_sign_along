
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OrdersTable from './OrdersTable';
import { Order } from '@/hooks/useOrdersData';

interface OrdersTabsProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({ orders, isLoading, onViewOrder }) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="recent">Recent Orders</TabsTrigger>
        <TabsTrigger value="event">Event Tickets</TabsTrigger>
        <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <OrdersTable 
              orders={orders}
              isLoading={isLoading}
              onViewOrder={onViewOrder}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="recent">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Orders from the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              Would display recent orders with similar table structure
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="event">
        <Card>
          <CardHeader>
            <CardTitle>Event Ticket Orders</CardTitle>
            <CardDescription>Orders containing event tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              Would display event ticket orders with similar table structure
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="merchandise">
        <Card>
          <CardHeader>
            <CardTitle>Merchandise Orders</CardTitle>
            <CardDescription>Orders containing merchandise items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              Would display merchandise orders with similar table structure
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTabs;
