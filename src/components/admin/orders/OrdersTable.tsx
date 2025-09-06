import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Tag, TicketIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/hooks/useOrdersData';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, onViewOrder }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brunch-purple"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No orders found.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {order.items.map((item, index) => {
                    let itemName = '';
                    let itemDetails = '';
                    let itemIcon = null;

                    if (item.type === 'ticket') {
                      itemName = item.event_title;
                      itemDetails = item.tier;
                      itemIcon = <TicketIcon className="h-4 w-4 text-blue-500" />;
                    } else if (item.type === 'merchandise') {
                      itemName = item.name;
                      itemDetails = item.size && item.color ? `${item.size} / ${item.color}` : '';
                      itemIcon = <Tag className="h-4 w-4 text-emerald-500" />;
                    } else if (item.type === 'food_service') {
                      itemName = 'Food Service';
                      itemDetails = '';
                      itemIcon = <div className="text-amber-500">🍽️</div>;
                    }

                    return (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-800">
                        {itemIcon}
                        <div>
                          <div className="font-medium">{itemName}</div>
                          {itemDetails && <div className="text-xs text-gray-500">{itemDetails}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-xs text-gray-500">{order.customer.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(order.order_date)}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(order.total_amount)}</TableCell>
              <TableCell>
                {order.payment_status === 'completed' ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    {order.payment_status}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewOrder(order)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
