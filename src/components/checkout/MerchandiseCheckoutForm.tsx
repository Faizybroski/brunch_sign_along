
import React, { useEffect } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CustomerInfo from './CustomerInfo';
import PaymentDetails from './PaymentDetails';
import ShippingAddressForm from './ShippingAddressForm';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Form schema
const merchandiseCheckoutSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  birthdate: z.string().min(1, { message: "Birthdate is required" }),
  cardNumber: z.string().min(16, { message: "Valid card number is required" }),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cardCvc: z.string().length(3, { message: "CVC must be 3 digits" }),
  // Shipping address fields only required when shipping
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
}).refine((data) => {
  // If we have shipping address fields in the form, they must be filled
  const needsShippingInfo = document.getElementById('shipping-fields') !== null;
  if (needsShippingInfo) {
    return !!data.addressLine1 && !!data.city && !!data.state && !!data.zipCode && !!data.country;
  }
  return true;
}, {
  message: "Shipping address is required when shipping method is selected",
  path: ["addressLine1"],
});

type MerchandiseCheckoutValues = z.infer<typeof merchandiseCheckoutSchema>;

interface MerchandiseCheckoutFormProps {
  deliveryMethod: string;
  total: number;
  onSubmit: (values: MerchandiseCheckoutValues) => void;
  isSubmitting: boolean;
}

const MerchandiseCheckoutForm = ({ 
  deliveryMethod, 
  total, 
  onSubmit, 
  isSubmitting 
}: MerchandiseCheckoutFormProps) => {
  const form = useForm<MerchandiseCheckoutValues>({
    resolver: zodResolver(merchandiseCheckoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    mode: "onChange" // Validate on change for better user experience
  });

  // Validation for shipping fields
  useEffect(() => {
    if (deliveryMethod === 'ship') {
      form.trigger(['addressLine1', 'city', 'state', 'zipCode', 'country']);
    }
  }, [deliveryMethod, form]);

  const handleSubmit = async (values: MerchandiseCheckoutValues) => {
    try {
      console.log("Form submitted with values:", values);
      
      // Check if required shipping fields are filled when shipping is selected
      if (deliveryMethod === 'ship') {
        if (!values.addressLine1 || !values.city || !values.state || !values.zipCode || !values.country) {
          toast.error("Please fill in all shipping address fields");
          return;
        }
      }
      
      onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("There was an error submitting the form. Please check all fields and try again.");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Customer Information */}
            <CustomerInfo form={form} />
            
            {/* Shipping Information (if shipping selected) */}
            {deliveryMethod === 'ship' && (
              <div id="shipping-fields">
                <ShippingAddressForm form={form} />
              </div>
            )}
            
            {/* Payment Details */}
            <PaymentDetails form={form} />
            
            <Button 
              type="submit" 
              className="w-full bg-brunch-pink hover:bg-brunch-purple"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MerchandiseCheckoutForm;
