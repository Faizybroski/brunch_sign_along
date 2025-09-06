
import * as React from 'npm:react@18.3.1'
import { Section, Text } from 'npm:@react-email/components@0.0.22'

interface EventDetailsProps {
  eventTitle: string
  eventDate: string
  quantity: string
  ticketType: string
  ticketPrice: string
  location?: string
  venueAddress?: string
  eventTime?: string
}

export const EventDetails = ({
  eventTitle,
  eventDate,
  quantity,
  ticketType,
  ticketPrice,
  location = "Stock Bar Montreal",
  venueAddress = "1171 Rue Sainte-Catherine E, Montreal, QC H2L 2G8",
  eventTime = "2:00 PM - 4:00 PM"
}: EventDetailsProps) => {
  console.log("Rendering EventDetails component with:", {
    eventTitle, eventDate, quantity, ticketType, ticketPrice, location, venueAddress, eventTime
  });
  
  return (
    <Section style={section}>
      <div style={card}>
        <Text style={title}>Event Details</Text>
        <Text style={detail}>
          <strong>Event:</strong> {eventTitle}
        </Text>
        <Text style={detail}>
          <strong>Date:</strong> {eventDate}
        </Text>
        <Text style={detail}>
          <strong>Time:</strong> {eventTime}
        </Text>
        <Text style={detail}>
          <strong>Venue:</strong> {location}
        </Text>
        <Text style={detail}>
          <strong>Address:</strong> {venueAddress}
        </Text>
        <Text style={detail}>
          <strong>Tickets:</strong> {quantity} x {ticketType} (${ticketPrice} each)
        </Text>
      </div>
    </Section>
  );
};

const section = {
  paddingBottom: '20px',
}

const card = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  marginBottom: '16px',
  border: '1px solid #e6ebf1',
}

const title = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#9b87f5',
  marginTop: '0',
  marginBottom: '12px',
}

const detail = {
  fontSize: '14px',
  color: '#333',
  marginTop: '0',
  marginBottom: '8px',
  lineHeight: '1.5',
}
