
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  birthdate: z.string().min(1, { message: "Birthdate is required" }),
  cardNumber: z.string().min(16, { message: "Valid card number is required" }),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cardCvc: z.string().length(3, { message: "CVC must be 3 digits" }),
  includeFoodService: z.boolean().default(false),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const useCheckoutForm = (
  eventId: string, 
  tierPrice: number, 
  quantity: number,
  includeFoodService: boolean = false,
  foodServicePrice: number = 0
) => {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      includeFoodService: includeFoodService,
    },
  });

  return { form };
};
