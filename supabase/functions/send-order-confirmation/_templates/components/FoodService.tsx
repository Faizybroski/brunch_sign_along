
import * as React from 'npm:react@18.3.1'
import { Heading, Text, Section } from 'npm:@react-email/components@0.0.22'

interface FoodServiceProps {
  foodServicePrice: string
}

export const FoodService = ({ foodServicePrice }: FoodServiceProps) => (
  <Section style={section}>
    <div style={card}>
      <Heading as="h2" style={h2}>Food Service</Heading>
      <Text style={text}>
        Premium Buffet Service Included
      </Text>
      <Text style={timeInfo}>
        Food Service Time: 12:30 PM - 2:00 PM
      </Text>
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
  margin: '0 0 10px',
}

const text = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '10px 0',
}

const timeInfo = {
  fontSize: '14px',
  color: '#666666',
  margin: '10px 0 0',
  fontStyle: 'italic' as const,
}
