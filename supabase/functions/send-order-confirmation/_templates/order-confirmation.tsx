
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { Header } from './components/Header.tsx'
import { EventDetails } from './components/EventDetails.tsx'
import { FoodService } from './components/FoodService.tsx'
import { OrderSummary } from './components/OrderSummary.tsx'
import { Footer } from './components/Footer.tsx'
import { MerchandiseDetails } from './components/MerchandiseDetails.tsx'

interface OrderConfirmationEmailProps {
  orderId: string
  eventTitle?: string
  eventDate?: string
  quantity: string
  ticketType?: string
  ticketPrice?: string
  includeFoodService?: boolean
  foodServicePrice?: string
  taxAndFees: string
  total: string
  subtotal: string
  location?: string
  venueAddress?: string
  eventTime?: string 
  email?: string
  
  // Merchandise specific fields
  orderType?: string
  itemName?: string
  itemPrice?: string
  deliveryMethod?: string
  shippingFee?: string
  address?: string
}

export const OrderConfirmationEmail = ({
  orderId,
  eventTitle,
  eventDate,
  quantity,
  ticketType,
  ticketPrice,
  includeFoodService,
  foodServicePrice,
  taxAndFees,
  total,
  subtotal,
  location = "Stock Bar Montreal",
  venueAddress = "1171 Rue Sainte-Catherine E, Montreal, QC H2L 2G8",
  eventTime = "2:00 PM - 4:00 PM",
  orderType = 'ticket',
  itemName,
  itemPrice,
  deliveryMethod,
  shippingFee,
  address
}: OrderConfirmationEmailProps) => {
  console.log("Rendering OrderConfirmationEmail with props:", { 
    orderId, eventTitle, eventDate, quantity, ticketType, ticketPrice, 
    includeFoodService, foodServicePrice, taxAndFees, total, subtotal,
    location, venueAddress, eventTime, orderType, itemName, itemPrice,
    deliveryMethod, shippingFee, address
  });
  
  const isMerchandiseOrder = orderType === 'merchandise';
  
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </Head>
      <Preview>Your Brunch Singalong {isMerchandiseOrder ? 'Order' : 'Tickets'} - Order #{orderId.slice(0, 8).toUpperCase()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header isMerchandiseOrder={isMerchandiseOrder} />
          
          <Section style={headerSection}>
            <Heading style={h1}>Thanks for Your Order!</Heading>
            <Text style={orderNumber}>Order #: {orderId.slice(0, 8).toUpperCase()}</Text>
          </Section>

          <Section style={contentSection}>
            {isMerchandiseOrder ? (
              <MerchandiseDetails
                itemName={itemName || ''}
                quantity={quantity}
                itemPrice={itemPrice || ''}
                deliveryMethod={deliveryMethod || 'pickup'}
                address={address || ''}
              />
            ) : (
              <EventDetails
                eventTitle={eventTitle || ''}
                eventDate={eventDate || ''}
                quantity={quantity}
                ticketType={ticketType || ''}
                ticketPrice={ticketPrice || ''}
                location={location}
                venueAddress={venueAddress}
                eventTime={eventTime}
              />
            )}

            {!isMerchandiseOrder && includeFoodService && <FoodService foodServicePrice={foodServicePrice || '0'} />}
            
            <Hr style={divider} />

            <OrderSummary
              quantity={quantity}
              ticketPrice={isMerchandiseOrder ? itemPrice : ticketPrice}
              includeFoodService={!isMerchandiseOrder && includeFoodService}
              foodServicePrice={foodServicePrice}
              taxAndFees={taxAndFees}
              total={total}
              subtotal={subtotal}
              isMerchandiseOrder={isMerchandiseOrder}
              shippingFee={shippingFee}
              deliveryMethod={deliveryMethod}
            />
          </Section>

          <Footer isMerchandiseOrder={isMerchandiseOrder} />
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 0',
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
}

const headerSection = {
  backgroundColor: '#ffffff',
  padding: '40px 20px 20px',
  textAlign: 'center' as const,
}

const contentSection = {
  backgroundColor: '#ffffff',
  padding: '0 20px 20px',
}

const h1 = {
  color: '#9b87f5',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
  textAlign: 'center' as const,
  fontFamily: 'Poppins, sans-serif',
}

const orderNumber = {
  color: '#666666',
  fontSize: '16px',
  margin: '0',
}

const divider = {
  borderTop: '1px solid #e6ebf1',
  margin: '20px 0',
}
