import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from "@/components/ui/form";
import { useEventData } from '@/hooks/useEventData';
import { useVIPPackages } from '@/hooks/useVIPPackages';
import { useNormalizeEventData } from '@/hooks/useNormalizeEventData';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useCheckoutCalculations } from '@/hooks/useCheckoutCalculations';
import { useCheckoutHandler } from '@/hooks/useCheckoutHandler';
import { useCheckoutParams } from '@/hooks/useCheckoutParams';
import { useTicketInventory } from '@/hooks/useTicketInventory';
import { foodServiceConfig } from '@/config/foodService';
import CustomerInfo from '@/components/checkout/CustomerInfo';
import PaymentDetails from '@/components/checkout/PaymentDetails';
import OrderSummary from '@/components/checkout/OrderSummary';
import EventDetails from '@/components/checkout/EventDetails';
import FoodServiceSelection from '@/components/checkout/FoodServiceSelection';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';

const Checkout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isValidatingTicket, setIsValidatingTicket] = useState(true);
  const [ticketValid, setTicketValid] = useState<boolean | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const { data: eventData, isLoading: isLoadingEvent } = useEventData(eventId);
  const { data: vipPackages } = useVIPPackages(Number(eventId));
  const { normalizeEventData, ensureEventData } = useNormalizeEventData();
  const { checkTicketAvailability } = useTicketInventory();
  
  const {
    tierTitle,
    quantity,
    ticketType,
    includeFoodService,
    foodServicePrice,
    handleQuantityChange,
    handleToggleFoodService
  } = useCheckoutParams();

  const normalizedEvent = normalizeEventData(eventData);
  const event = ensureEventData(normalizedEvent);
  
  // Initialize the checkout handler first
  const { handleFormSubmit, getTierPrice } = useCheckoutHandler({
    eventId,
    ticketType,
    tierTitle,
    tierPrice: 0, // We'll calculate this correctly after initialization
    quantity,
    event,
    vipPackages
  });
  
  // Now use the getTierPrice function that's properly defined
  const calculatedTierPrice = getTierPrice();

  const { form } = useCheckoutForm(
    eventId || '', 
    calculatedTierPrice, 
    quantity, 
    includeFoodService, 
    foodServicePrice
  );
  
  const { total, subtotal, foodServiceTotal, taxAndServiceFee } = useCheckoutCalculations(
    calculatedTierPrice, 
    quantity, 
    foodServicePrice, 
    includeFoodService
  );

  // Validate ticket availability on page load
  useEffect(() => {
    const validateTicket = async () => {
      if (eventId && tierTitle && ticketType) {
        const numericEventId = parseInt(eventId, 10);
        if (!isNaN(numericEventId)) {
          setIsValidatingTicket(true);
          const isValid = await checkTicketAvailability(
            numericEventId,
            ticketType,
            tierTitle,
            quantity
          );
          setTicketValid(isValid);
          setIsValidatingTicket(false);
          
          // If invalid, redirect after a short delay
          if (!isValid) {
            toast.error('Selected tickets are unavailable. Redirecting to ticket selection.');
            setTimeout(() => {
              navigate(`/pricing/${eventId}?type=${ticketType}`);
            }, 3000);
          }
        }
      }
    };
    
    validateTicket();
  }, [eventId, tierTitle, ticketType, quantity]);

  useEffect(() => {
    if (form) {
      form.setValue("includeFoodService", includeFoodService);
    }
  }, [includeFoodService, form]);

  if (isLoadingEvent || isValidatingTicket) {
    return (
      <div className="min-h-screen py-20 bg-brunch-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brunch-purple mx-auto mb-4"></div>
          <p>{isValidatingTicket ? 'Verifying ticket availability...' : 'Loading checkout...'}</p>
        </div>
      </div>
    );
  }

  if (ticketValid === false) {
    return (
      <div className="min-h-screen py-20 bg-brunch-light flex items-center justify-center">
        <div className="container max-w-md mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ticket Unavailable</AlertTitle>
            <AlertDescription>
              The selected tickets are not available. You will be redirected to the ticket selection page.
            </AlertDescription>
          </Alert>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate(`/pricing/${eventId}?type=${ticketType}`)}
          >
            Go Back to Ticket Selection
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmitWithValidation = async (data: any) => {
    const numericEventId = parseInt(eventId || '0', 10);
    
    // Set processing state to disable button and show spinner
    setIsProcessingPayment(true);
    
    try {
      // Double-check ticket availability before submitting
      const ticketsAvailable = await checkTicketAvailability(
        numericEventId,
        ticketType,
        tierTitle,
        quantity
      );
      
      if (ticketsAvailable) {
        await handleFormSubmit(data, foodServicePrice);
      } else {
        toast.error('Selected tickets are no longer available.');
        setTimeout(() => {
          navigate(`/pricing/${eventId}?type=${ticketType}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      // Reset processing state
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-brunch-light">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-brunch-purple to-brunch-accent bg-clip-text text-transparent drop-shadow-sm">
          Checkout
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <EventDetails 
              event={event}
              quantity={quantity}
              ticketType={ticketType}
              onQuantityChange={handleQuantityChange}
            />
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <FoodServiceSelection 
                  form={form}
                  foodServiceDescription={foodServiceConfig.description}
                  foodServicePrice={foodServiceConfig.price}
                  quantity={quantity}
                  includeFoodService={includeFoodService}
                  onToggleFoodService={handleToggleFoodService}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmitWithValidation)} className="space-y-6">
                    <CustomerInfo form={form} />
                    <PaymentDetails form={form} />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-brunch-purple hover:bg-brunch-purple-dark"
                        disabled={!ticketValid || isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay ${total.toFixed(2)}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <OrderSummary
              quantity={quantity}
              ticketType={ticketType}
              ticketPrice={calculatedTierPrice}
              foodServicePrice={foodServicePrice}
              includeFoodService={includeFoodService}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
