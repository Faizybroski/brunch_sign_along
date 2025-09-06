
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useOrderData } from '@/hooks/useOrderData';
import MerchandiseCouponCard from '@/components/checkout/MerchandiseCouponCard';
import OrderHeader from '@/components/order-confirmation/OrderHeader';
import EmailAlert from '@/components/order-confirmation/EmailAlert';
import OrderDetails from '@/components/order-confirmation/OrderDetails';
import SupportSection from '@/components/order-confirmation/SupportSection';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showEmailAlert, setShowEmailAlert] = useState(true);
  
  // Get all parameters from URL using a memoized function to avoid redundant parsing
  const getParamValue = useCallback((key: string, defaultValue: string = '') => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);
  
  // Parse parameters from URL (fallback for when database fetch fails)
  const orderId = getParamValue('orderId', 'N/A');
  const total = getParamValue('total', '0');
  const subtotal = getParamValue('subtotal', '0');
  const eventTitle = getParamValue('eventTitle', '');
  const eventDate = getParamValue('eventDate', '');
  const quantity = getParamValue('quantity', '1');
  const includeFoodService = getParamValue('includeFoodService') === 'true';
  const foodServicePrice = getParamValue('foodServicePrice', '0');
  const taxAndFees = getParamValue('taxAndFees', '0');
  const ticketPrice = getParamValue('ticketPrice', '');
  const ticketType = getParamValue('ticketType', '');
  const forceHideBadge = getParamValue('forceHideBadge') === 'true';
  const simulatedEmail = getParamValue('simulatedEmail') === 'true';
  const email = getParamValue('email', '');
  
  // Merchandise specific parameters
  const orderType = getParamValue('orderType', 'ticket');
  const itemName = getParamValue('itemName', '');
  const itemPrice = getParamValue('itemPrice', '');
  const deliveryMethod = getParamValue('deliveryMethod', '');
  const shippingFee = getParamValue('shippingFee', '0');
  const address = getParamValue('address', '');
  const eventId = getParamValue('eventId', '');
  
  // Fetch real order data from database
  const { orderData, isLoading, error } = useOrderData(orderId);
  
  const formattedOrderId = orderId !== 'N/A' ? orderId.slice(0, 8).toUpperCase() : 'N/A';

  // Use database data if available, otherwise fall back to URL parameters
  const displayData = orderData ? {
    orderType: orderData.tickets && orderData.tickets.length > 0 ? 'ticket' : 'merchandise',
    eventTitle: orderData.tickets?.[0]?.eventTitle || eventTitle,
    eventDate: orderData.tickets?.[0]?.eventDate || eventDate,
    ticketType: orderData.tickets?.[0]?.ticketType || ticketType,
    ticketPrice: orderData.tickets?.[0]?.unitPrice?.toString() || ticketPrice,
    includeFoodService: orderData.tickets?.[0]?.includeFoodService || includeFoodService,
    foodServicePrice: orderData.tickets?.[0]?.foodServicePrice?.toString() || foodServicePrice,
    quantity: orderData.tickets?.[0]?.quantity?.toString() || orderData.merchandise?.[0]?.quantity?.toString() || quantity,
    itemName: orderData.merchandise?.[0]?.itemName || itemName,
    itemPrice: orderData.merchandise?.[0]?.unitPrice?.toString() || itemPrice,
    total: orderData.totalAmount?.toString() || total,
    subtotal: subtotal, // Calculate from database data if needed
    taxAndFees: taxAndFees, // Calculate from database data if needed
    email: orderData.customerEmail || email
  } : {
    orderType,
    eventTitle,
    eventDate,
    ticketType,
    ticketPrice,
    includeFoodService,
    foodServicePrice,
    quantity,
    itemName,
    itemPrice,
    total,
    subtotal,
    taxAndFees,
    email
  };

  useEffect(() => {
    console.log("Order Confirmation Values:", {
      orderId,
      orderType: displayData.orderType,
      ticketPrice: displayData.ticketPrice,
      itemPrice: displayData.itemPrice,
      quantity: displayData.quantity,
      foodServicePrice: displayData.foodServicePrice,
      taxAndFees: displayData.taxAndFees,
      subtotal: displayData.subtotal,
      total: displayData.total,
      deliveryMethod,
      urlParams: Object.fromEntries(searchParams.entries()),
      databaseData: orderData,
      isLoading,
      error
    });
    
    // Show success message for fresh orders
    if (orderId !== 'N/A' && !forceHideBadge) {
      if (simulatedEmail) {
        toast.info("Order confirmed! Email simulation active in development mode.", {
          description: "Your order was saved successfully. In production, confirmation emails will be sent automatically.",
          duration: 10000,
        });
      } else {
        toast.success("Your order has been processed successfully!", {
          description: "Please check your email for your receipt and confirmation details.",
          duration: 10000,
        });
      }
    }

    // Set a timeout to hide the email alert after 60 seconds
    const timer = setTimeout(() => {
      setShowEmailAlert(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [orderId, forceHideBadge, searchParams, orderData, isLoading, error, simulatedEmail]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 bg-brunch-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brunch-purple mx-auto mb-4"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-brunch-light">
      <div className="container mx-auto px-4 max-w-2xl">
        <OrderHeader orderType={displayData.orderType} formattedOrderId={formattedOrderId} />

        {showEmailAlert && !forceHideBadge && (
          <EmailAlert 
            simulatedEmail={simulatedEmail} 
            email={displayData.email}
            orderType={displayData.orderType}
          />
        )}

        <OrderDetails 
          orderType={displayData.orderType}
          eventTitle={displayData.eventTitle}
          eventDate={displayData.eventDate}
          ticketType={displayData.ticketType}
          ticketPrice={displayData.ticketPrice}
          includeFoodService={displayData.includeFoodService}
          foodServicePrice={displayData.foodServicePrice}
          itemName={displayData.itemName}
          itemPrice={displayData.itemPrice}
          deliveryMethod={deliveryMethod}
          address={address}
          quantity={displayData.quantity}
          taxAndFees={displayData.taxAndFees}
          subtotal={displayData.subtotal}
          total={displayData.total}
          shippingFee={shippingFee}
        />

        {/* Only show merchandise coupon for ticket purchases */}
        {displayData.orderType === 'ticket' && (
          <MerchandiseCouponCard orderId={orderId} eventId={eventId} />
        )}

        {/* "Need Help" section below the coupon */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <SupportSection 
              formattedOrderId={formattedOrderId}
              orderId={orderId}
              orderType={displayData.orderType}
              eventTitle={displayData.eventTitle}
              eventDate={displayData.eventDate}
              itemName={displayData.itemName}
              total={displayData.total}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
