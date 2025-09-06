
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

interface OrderNavigationProps {
  navigate: NavigateFunction;
  orderId: string;
  total: number;
  subtotal: number;
  taxAndFees: number;
  itemNamesList: string;
  itemPrice: string;
  deliveryMethod: string;
  email: string;
  quantity: number;
  simulatedEmail: boolean;
  shippingFee?: number;
  address?: string;
  eventId?: string;
  couponApplied?: boolean;
  couponDiscount?: number;
}

/**
 * Handles navigation to the order confirmation page with all required parameters
 */
export const navigateToOrderConfirmation = ({
  navigate,
  orderId,
  total,
  subtotal,
  taxAndFees,
  itemNamesList,
  itemPrice,
  deliveryMethod,
  email,
  quantity,
  simulatedEmail,
  shippingFee = 0,
  address = '',
  eventId = '',
  couponApplied = false,
  couponDiscount = 0
}: OrderNavigationProps) => {
  // Prepare URL parameters for confirmation page
  const params = new URLSearchParams({
    orderId,
    total: total.toFixed(2),
    subtotal: subtotal.toFixed(2),
    taxAndFees: taxAndFees.toFixed(2),
    quantity: quantity.toString(),
    itemName: itemNamesList,
    itemPrice,
    deliveryMethod,
    email,
    orderType: 'merchandise',
    simulatedEmail: simulatedEmail.toString(),
    ...(couponApplied ? {
      couponApplied: 'true',
      couponDiscount: couponDiscount.toString()
    } : {}),
    ...(deliveryMethod === 'ship' ? {
      shippingFee: shippingFee.toString(),
      address
    } : {
      eventId
    })
  });

  console.log("Navigating to order confirmation with params:", params.toString());
  
  // Delay navigation slightly to allow toast to be seen
  setTimeout(() => {
    navigate(`/order-confirmation?${params.toString()}`);
  }, 1500);
};
