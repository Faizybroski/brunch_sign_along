
import * as React from 'npm:react@18.3.1'
import { Heading, Text, Section } from 'npm:@react-email/components@0.0.22'

interface MerchandiseDetailsProps {
  itemName: string
  quantity: string
  itemPrice: string
  deliveryMethod: string
  address: string
}

export const MerchandiseDetails = ({
  itemName,
  quantity,
  itemPrice,
  deliveryMethod,
  address
}: MerchandiseDetailsProps) => (
  <Section style={section}>
    <div style={card}>
      <Heading as="h2" style={h2}>Your Order Details</Heading>
      <Text style={itemText}>
        {itemName}
      </Text>
      <Text style={quantityText}>
        Quantity: {quantity}
      </Text>
      <Text style={priceText}>
        Price: ${itemPrice} per item
      </Text>
      
      <Heading as="h3" style={h3}>Delivery Information</Heading>
      <Text style={deliveryText}>
        Delivery Method: <span style={bold}>{deliveryMethod === 'ship' ? 'Shipping' : 'Event Pickup'}</span>
      </Text>
      
      {deliveryMethod === 'ship' && address && (
        <Text style={addressText}>
          Shipping to: {address}
        </Text>
      )}
      
      {deliveryMethod === 'pickup' && (
        <Text style={pickupText}>
          Please pick up your merchandise at the event. Remember to bring your order confirmation.
        </Text>
      )}
    </div>
  </Section>
)

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

const h2 = {
  color: '#9b87f5',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '0 0 15px',
}

const h3 = {
  color: '#9b87f5',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  margin: '20px 0 10px',
}

const itemText = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '10px 0 5px',
  fontWeight: 'bold' as const,
}

const quantityText = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '5px 0',
}

const priceText = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '5px 0 15px',
}

const deliveryText = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '5px 0',
}

const addressText = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '10px 0',
  padding: '10px',
  backgroundColor: '#fff',
  borderRadius: '5px',
  border: '1px dashed #ddd',
}

const pickupText = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '10px 0',
  fontStyle: 'italic' as const,
}

const bold = {
  fontWeight: 'bold' as const,
}
