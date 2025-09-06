
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SupportSectionProps {
  formattedOrderId: string;
  orderId: string;
  orderType: string;
  eventTitle?: string;
  eventDate?: string;
  itemName?: string;
  total?: string;
}

const SupportSection: React.FC<SupportSectionProps> = ({ 
  formattedOrderId, 
  orderId,
  orderType,
  eventTitle,
  eventDate,
  itemName,
  total
}) => {
  // Use useCallback to memoize these functions and prevent unnecessary re-renders
  const handleContactSupport = useCallback(() => {
    // Prepare email content
    const subject = `Support Request - Order ${formattedOrderId}`;
    const orderTypeText = orderType === 'ticket' ? 'Ticket Order' : 'Merchandise Order';
    
    // Simple email body with essential information
    const body = `Hello Support Team,\n\nI need assistance with my ${orderTypeText}.\n\nOrder ID: ${orderId}\n\nThank you.`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Open email client with pre-filled details
    window.location.href = `mailto:tickets@brunchsingalong.com?subject=${encodedSubject}&body=${encodedBody}`;
  }, [formattedOrderId, orderId, orderType]);

  const copyOrderInfo = useCallback(() => {
    const orderTypeText = orderType === 'ticket' ? 'Ticket Order' : 'Merchandise Order';
    let orderDetails = `Order ID: ${orderId}\nOrder Type: ${orderTypeText}\n`;
    
    if (orderType === 'ticket') {
      orderDetails += `Event: ${eventTitle || 'N/A'}\nDate: ${eventDate || 'N/A'}\n`;
    } else {
      orderDetails += `Item(s): ${itemName || 'N/A'}`;
    }
    
    if (total) {
      orderDetails += `\nTotal: $${total}\n`;
    }
    
    try {
      navigator.clipboard.writeText(orderDetails);
      toast("Order information copied!", {
        description: "Details copied to clipboard for your reference",
      });
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Could not copy to clipboard. Please try again.");
    }
  }, [orderId, orderType, eventTitle, eventDate, itemName, total]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-center">Need Help With Your Order?</h3>
      
      <div className="flex flex-col space-y-3">
        <Button
          variant="default"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleContactSupport}
        >
          <Mail className="h-4 w-4" />
          Contact Support via Email
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={copyOrderInfo}
        >
          <Copy className="h-4 w-4" />
          Copy Order Information
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mt-1 mb-2">
            <span className="font-medium block mt-1">tickets@brunchsingalong.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
