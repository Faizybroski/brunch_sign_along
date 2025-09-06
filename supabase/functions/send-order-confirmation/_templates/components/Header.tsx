
import * as React from 'npm:react@18.3.1'
import { Section, Text, Img } from 'npm:@react-email/components@0.0.22'

interface HeaderProps {
  isMerchandiseOrder?: boolean;
}

export const Header = ({ isMerchandiseOrder = false }: HeaderProps) => {
  console.log("Rendering Header component", { isMerchandiseOrder });
  
  // Using React.useState isn't available in React Email's server-side rendering
  // So we'll use a ref to track if image loaded successfully
  const [imageLoaded, setImageLoaded] = React.useState(true);
  
  // URLs for both logo types
  const logoUrl = isMerchandiseOrder 
    ? "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/brunch_logo.png" 
    : "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/brunch-singalong-logo.jpeg";
  
  // Add a log to help debug the logo URL
  console.log("Using logo URL:", logoUrl);
  
  return (
    <Section style={isMerchandiseOrder ? headerMerchandise : header}>
      <div style={logoContainer}>
        {/* Only show the image, with onError handling in case it fails to load */}
        <Img
          src={logoUrl}
          width={isMerchandiseOrder ? "180" : "300"}
          height={isMerchandiseOrder ? "60" : "100"}
          alt={isMerchandiseOrder ? "Brunch Merchandise" : "Brunch Singalong"}
          style={{
            ...logoImage,
            objectFit: "contain",
            maxWidth: isMerchandiseOrder ? "180px" : "300px",
            height: "auto"
          }}
          onError={() => {
            console.log("Logo image failed to load, falling back to text");
            setImageLoaded(false);
          }}
        />
        
        {/* Only render text if the image failed to load */}
        {!imageLoaded && (
          <Text style={{
            ...logoText,
            color: isMerchandiseOrder ? '#FF1493' : '#9b87f5'
          }}>
            {isMerchandiseOrder ? "Brunch Merchandise" : "Brunch Singalong"}
          </Text>
        )}
      </div>
    </Section>
  );
};

const header = {
  backgroundColor: '#ffffff',
  padding: '20px 0',
  textAlign: 'center' as const,
  borderBottom: '2px solid #9b87f5',
}

const headerMerchandise = {
  backgroundColor: '#ffffff',
  padding: '20px 0',
  textAlign: 'center' as const,
  borderBottom: '2px solid #FF1493', // Pink border for merchandise emails
}

const logoContainer = {
  margin: '0 auto',
  position: 'relative' as const,
}

const logoImage = {
  margin: '0 auto 10px',
  display: 'block',
  maxWidth: '300px',
}

const logoText = {
  fontFamily: '"Dancing Script", cursive',
  fontSize: '42px',
  color: '#9b87f5',
  textAlign: 'center' as const,
  fontWeight: 'bold' as const,
  margin: '0',
  padding: '0',
  lineHeight: '1.2',
  textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
}
