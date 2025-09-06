
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
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
import { 
  ShoppingBag, 
  Calendar, 
  Download, 
  CreditCard, 
  Tag, 
  Mail, 
  User 
} from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/hooks/useOrdersData';

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

// Custom icon for ticket
const TicketIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 7v2a3 3 0 1 1 0 6v2h18v-2a3 3 0 1 1 0-6V7z" />
    <path d="M13 5v14" />
  </svg>
);

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, isOpen, onClose }) => {
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

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Order Date</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-brunch-purple" />
                {formatDate(order.order_date)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Payment Status</div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-brunch-purple" />
                <Badge variant="outline" className={
                  order.payment_status === 'completed' 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                }>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Total Amount</div>
              <div className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2 text-brunch-purple" />
                {formatCurrency(order.total_amount)}
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <div className="flex items-center mb-2 md:mb-0">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{order.customer.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-3">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => {
                  let itemName, itemDetails, itemIcon;
                  
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
                    itemIcon = <div className="h-4 w-4 text-amber-500">🍽️</div>;
                  }
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {itemIcon}
                          <span>{itemName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{itemDetails}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell>{formatCurrency(item.quantity * item.unit_price)}</TableCell>
                    </TableRow>
                  );
                })}
                
                {/* Total Row */}
                <TableRow>
                  <TableCell colSpan={4} className="font-medium text-right">
                    Total:
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-brunch-purple hover:bg-brunch-purple-dark">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
