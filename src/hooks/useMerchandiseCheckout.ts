
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  validateCheckoutData, 
  generateOrderId,
  formatItemNamesList,
  handleCheckoutNotifications
} from '@/utils/checkoutSubmissionUtils';
import { sendMerchandiseOrderEmail } from '@/utils/orderEmailUtils';
import { navigateToOrderConfirmation } from '@/utils/orderNavigationUtils';
import { clearCoupon } from '@/utils/couponUtils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UseMerchandiseCheckoutProps {
  items: CartItem[];
  deliveryMethod: string;
  eventId: string;
  total: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  couponApplied?: boolean;
  couponDiscount?: number;
}

export const useMerchandiseCheckout = ({
  items,
  deliveryMethod,
  eventId,
  total,
  subtotal,
  tax,
  shippingFee,
  couponApplied = false,
  couponDiscount = 0
}: UseMerchandiseCheckoutProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: any) => {
    if (isSubmitting) {
      console.log("Already processing a submission, please wait");
      return;
    }

    try {
      setIsSubmitting(true);
      handleCheckoutNotifications(true);

      console.log("Starting checkout process with values:", values);
      console.log("Cart items:", items);
      console.log("Coupon applied:", couponApplied, "Discount amount:", couponDiscount);

      // Validate input data
      validateCheckoutData(values, items);

      // Generate a unique order ID
      const orderId = generateOrderId();
      console.log("Generated order ID:", orderId);

      // Create a comma-separated list of item names
      const itemNamesList = formatItemNamesList(items);

      // Send email confirmation
      const { emailSent, emailError, simulatedEmail } = await sendMerchandiseOrderEmail({
        orderId,
        email: values.email,
        total,
        subtotal,
        taxAndFees: tax,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        orderType: 'merchandise',
        itemName: itemNamesList,
        itemPrice: (subtotal / items.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2),
        deliveryMethod,
        address: deliveryMethod === 'ship' ? `${values.addressLine1}, ${values.city}, ${values.state} ${values.zipCode}` : '',
        shippingFee,
        couponApplied,
        couponDiscount
      });
      
      console.log("Email result:", { emailSent, emailError, simulatedEmail });

      // Clear the coupon after successful purchase
      if (couponApplied) {
        clearCoupon();
      }

      handleCheckoutNotifications(false, "Order processed successfully!");

      // Navigate to the confirmation page
      navigateToOrderConfirmation({
        navigate,
        orderId,
        total,
        subtotal,
        taxAndFees: tax,
        itemNamesList,
        itemPrice: (subtotal / items.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2),
        deliveryMethod,
        email: values.email,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        simulatedEmail,
        shippingFee,
        address: deliveryMethod === 'ship' ? `${values.addressLine1}, ${values.city}, ${values.state} ${values.zipCode}` : '',
        eventId,
        couponApplied,
        couponDiscount
      });

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.dismiss();
      toast.error(`Error: ${error.message || 'There was an error processing your order. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
