import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PaymentDetailsProps {
  form: UseFormReturn<any>;
}

const PaymentDetails = ({ form }: PaymentDetailsProps) => {
  const formatExpiryDate = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Add slash after 2 digits if there are more than 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    return cleaned;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Details</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input placeholder="4242 4242 4242 4242" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cardExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/YY" 
                    maxLength={5}
                    {...field}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      e.target.value = formatted;
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardCvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input placeholder="123" type="password" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
