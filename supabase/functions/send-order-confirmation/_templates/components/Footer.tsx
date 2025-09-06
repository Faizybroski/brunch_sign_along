
import { Section, Text, Link, Hr } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface FooterProps {
  isMerchandiseOrder?: boolean;
}

export const Footer = ({ isMerchandiseOrder = false }: FooterProps) => (
  <Section style={footerSection}>
    <Hr style={divider} />
    
    {!isMerchandiseOrder ? (
      <Text style={footerText}>
        Your tickets are attached to this email as a PDF file.<br />
        Please bring them with you (printed or on your phone) on the event day.
      </Text>
    ) : (
      <Text style={footerText}>
        Thank you for your merchandise purchase!<br />
        {/* We could add more merchandise-specific instructions here */}
      </Text>
    )}
    
    {!isMerchandiseOrder && (
      <Text style={importantInfo}>
        Doors open 30 minutes before show time
      </Text>
    )}
    
    <Text style={support}>
      Questions? Contact us at{' '}
      <Link href="mailto:tickets@brunchsingalong.com" style={link}>
        tickets@brunchsingalong.com
      </Link>
    </Text>
    <Text style={copyright}>
      © 2025 Brunch Singalong. All rights reserved.
    </Text>
  </Section>
)

const footerSection = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
}

const divider = {
  borderTop: '1px solid #e6ebf1',
  margin: '10px 0 20px',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 15px',
  textAlign: 'center' as const,
}

const importantInfo = {
  color: '#9b87f5',
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '0 0 15px',
  textAlign: 'center' as const,
}

const support = {
  color: '#8898aa',
  fontSize: '13px',
  margin: '15px 0 10px',
}

const link = {
  color: '#9b87f5',
  textDecoration: 'underline',
}

const copyright = {
  color: '#8898aa',
  fontSize: '12px',
  margin: '10px 0 0',
}
