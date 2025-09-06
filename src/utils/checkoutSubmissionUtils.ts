
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * Validates checkout form data
 */
export const validateCheckoutData = (values: any, items: CartItem[]) => {
  if (!items || items.length === 0) {
    throw new Error("No items in cart");
  }

  // Check if we have the required customer information
  if (!values.name || !values.email) {
    throw new Error("Missing required customer information");
  }
};

/**
 * Generates a unique order ID
 */
export const generateOrderId = () => {
  return uuidv4();
};

/**
 * Creates a formatted list of purchased items
 */
export const formatItemNamesList = (items: CartItem[]) => {
  return items.map(item => `${item.quantity}x ${item.name}`).join(", ");
};

/**
 * Manages toast notifications during checkout process
 */
export const handleCheckoutNotifications = (isStart: boolean, message?: string) => {
  if (isStart) {
    toast.loading("Processing your order...");
  } else {
    toast.dismiss();
    if (message) {
      toast.success(message);
    }
  }
};
