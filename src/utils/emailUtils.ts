
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailPayload {
  orderId: string;
  email: string;
  eventTitle?: string;
  eventDate?: string;
  quantity: string;
  ticketType?: string;
  ticketPrice?: string;
  includeFoodService?: boolean;
  foodServicePrice?: string;
  taxAndFees: string;
  total: string;
  subtotal: string;
  
  // Merchandise specific parameters
  orderType?: string;
  itemName?: string;
  itemPrice?: string;
  deliveryMethod?: string;
  shippingFee?: string;
  address?: string;
}

/**
 * Send order confirmation email using Supabase edge function
 */
export const sendOrderConfirmationEmail = async (payload: EmailPayload) => {
  let emailSent = false;
  let emailError = null;
  let simulatedEmail = false;

  try {
    console.log("Sending order confirmation email for order:", payload.orderId);
    
    // Show loading toast
    toast.loading("Sending confirmation email...");
    
    try {
      const { data: emailData, error: emailSendError } = await supabase.functions.invoke("send-order-confirmation", {
        body: payload
      });

      // Dismiss loading toast
      toast.dismiss();

      if (emailSendError) {
        console.error("Error sending confirmation email:", emailSendError);
        emailError = emailSendError;
        
        // Check if it's a domain verification issue
        if (emailSendError.message && emailSendError.message.includes("domain")) {
          simulatedEmail = true;
          console.log("EMAIL SIMULATION: Domain verification required, simulating email send");
          toast.info("Order confirmed! Email sending is simulated (domain verification required for production)");
        } else {
          toast.error("Order saved but email couldn't be sent. Please contact support if you need a confirmation copy.");
        }
      } else {
        if (emailData?.simulation) {
          simulatedEmail = true;
          console.log("EMAIL SIMULATION MODE: Development environment detected");
          toast.success("Order confirmed! Email simulation active (development mode)");
        } else {
          emailSent = true;
          console.log("Confirmation email sent successfully to:", payload.email);
          toast.success("Order confirmed! Check your email for confirmation details.");
        }
      }
    } catch (supabaseError) {
      console.error("Error invoking edge function:", supabaseError);
      emailError = supabaseError;
      
      // Dismiss loading toast
      toast.dismiss();
      
      // Check if it's a domain verification issue and handle gracefully
      if (String(supabaseError).includes("domain") || String(supabaseError).includes("verify")) {
        simulatedEmail = true;
        console.log("Simulating email due to domain verification requirement");
        toast.info("Order confirmed! Email sending simulated (domain verification required)");
      } else {
        toast.error("Order saved but there was a technical issue sending the confirmation email.");
      }
    }
  } catch (err) {
    console.error("Failed in email sending process:", err);
    emailError = err;
    toast.dismiss();
    toast.error("Order saved successfully, but confirmation email couldn't be sent.");
  }

  return { emailSent, emailError, simulatedEmail };
};
