
import { sendOrderConfirmationEmail } from './emailUtils';

interface EmailPayloadProps {
  orderId: string;
  email: string;
  total: number;
  subtotal: number;
  taxAndFees: number;
  quantity: number;
  orderType: string;
  itemName: string;
  itemPrice: string;
  deliveryMethod: string;
  address: string;
  shippingFee?: number;
  couponApplied?: boolean;
  couponDiscount?: number;
}

/**
 * Prepares and sends an email confirmation for merchandise orders
 */
export const sendMerchandiseOrderEmail = async (payload: EmailPayloadProps) => {
  // Reduced logging for performance
  
  const emailPayload = {
    orderId: payload.orderId,
    email: payload.email,
    total: payload.total.toFixed(2),
    subtotal: payload.subtotal.toFixed(2),
    taxAndFees: payload.taxAndFees.toFixed(2),
    quantity: payload.quantity.toString(),
    orderType: 'merchandise',
    itemName: payload.itemName,
    itemPrice: payload.itemPrice,
    deliveryMethod: payload.deliveryMethod,
    address: payload.address,
    shippingFee: payload.shippingFee?.toString() || '0'
  };
  
  return await sendOrderConfirmationEmail(emailPayload);
};
