
import * as React from 'npm:react@18.3.1'
import { Heading, Text, Section } from 'npm:@react-email/components@0.0.22'

interface OrderSummaryProps {
  quantity: string
  ticketPrice: string | undefined
  includeFoodService?: boolean
  foodServicePrice: string | undefined
  taxAndFees: string
  total: string
  subtotal: string
  isMerchandiseOrder?: boolean
  shippingFee?: string
  deliveryMethod?: string
}

export const OrderSummary = ({
  quantity,
  ticketPrice = '0',
  includeFoodService = false,
  foodServicePrice = '0',
  taxAndFees,
  total,
  subtotal,
  isMerchandiseOrder = false,
  shippingFee = '0',
  deliveryMethod
}: OrderSummaryProps) => (
  <Section>
    <Heading as="h2" style={h2}>Order Summary</Heading>

    <div style={summaryContainer}>
      {/* Item subtotal */}
      <div style={row}>
        <Text style={label}>
          {isMerchandiseOrder ? 'Item Subtotal' : 'Ticket Subtotal'}:
        </Text>
        <Text style={value}>
          ${subtotal}
        </Text>
      </div>

      {/* Food service if applicable */}
      {!isMerchandiseOrder && includeFoodService && (
        <div style={row}>
          <Text style={label}>
            Food Service ({quantity} {parseInt(quantity) === 1 ? 'person' : 'people'}):
          </Text>
          <Text style={value}>
            ${parseFloat(foodServicePrice || '0') * parseInt(quantity)}
          </Text>
        </div>
      )}
      
      {/* Shipping fee if applicable */}
      {isMerchandiseOrder && deliveryMethod === 'ship' && parseFloat(shippingFee) > 0 && (
        <div style={row}>
          <Text style={label}>
            Shipping Fee:
          </Text>
          <Text style={value}>
            ${shippingFee}
          </Text>
        </div>
      )}

      {/* Tax and fees */}
      <div style={row}>
        <Text style={label}>
          Tax & {isMerchandiseOrder ? 'Fees' : 'Service Fee'}:
        </Text>
        <Text style={value}>
          ${taxAndFees}
        </Text>
      </div>

      {/* Total */}
      <div style={{ ...row, borderTop: '2px solid #e6ebf1', paddingTop: '12px' }}>
        <Text style={{ ...label, fontWeight: 'bold' }}>
          Total:
        </Text>
        <Text style={{ ...value, fontWeight: 'bold', fontSize: '16px', color: '#9b87f5' }}>
          ${total}
        </Text>
      </div>
    </div>
  </Section>
)

const h2 = {
  color: '#9b87f5',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}

const summaryContainer = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '20px',
  border: '1px solid #e6ebf1',
}

const row = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  marginBottom: '10px',
}

const label = {
  margin: '0',
  fontSize: '14px',
  color: '#555',
}

const value = {
  margin: '0',
  fontSize: '14px',
  fontWeight: '500' as const,
  color: '#333',
}
