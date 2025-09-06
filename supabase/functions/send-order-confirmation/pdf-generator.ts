import { OrderConfirmationRequest } from "./types.ts";
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://ywmkycemozecroohrisr.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bWt5Y2Vtb3plY3Jvb2hyaXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MzQ2MjAsImV4cCI6MjA2MTMxMDYyMH0.2H1p4PZcg_fVpjcmwrreE0z3ZEaQQrv_VzC1gERQagM";
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to fetch image data from Supabase Storage
async function fetchImageFromStorage(path: string): Promise<Uint8Array | null> {
  try {
    console.log(`Fetching image from storage: ${path}`);
    
    const { data, error } = await supabase.storage
      .from('ticket-assets')
      .download(path);
    
    if (error) {
      console.error(`Error fetching image from storage: ${error.message}`);
      return null;
    }
    
    if (!data) {
      console.warn(`No data returned from storage for path: ${path}`);
      return null;
    }
    
    // Convert Blob to Uint8Array
    return new Uint8Array(await data.arrayBuffer());
  } catch (error) {
    console.error(`Exception fetching image from storage: ${error}`);
    return null;
  }
}

// Helper function to fetch image from URL with better error handling
async function fetchImageFromUrl(url: string): Promise<Uint8Array | null> {
  try {
    console.log(`Fetching image from URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (compatible; BrunchSingalongTicketGenerator/1.0)'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch image from URL: ${url}, status: ${response.status}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      console.warn(`Empty response from URL: ${url}`);
      return null;
    }
    
    console.log(`Successfully fetched image from URL: ${url}, size: ${arrayBuffer.byteLength} bytes`);
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.warn(`Error fetching from URL ${url}:`, error);
    return null;
  }
}

// Main function to generate the ticket PDF
export async function generateTicketPDF(orderData: OrderConfirmationRequest): Promise<Uint8Array> {
  try {
    console.log("Generating ticket PDF with data:", {
      orderId: orderData.orderId,
      eventTitle: orderData.eventTitle,
      eventDate: orderData.eventDate,
      ticketType: orderData.ticketType,
      quantity: orderData.quantity
    });
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    
    // Embed standard fonts
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Define colors
    const purpleColor = rgb(0.5, 0.1, 0.5); // Deep purple
    const pinkColor = rgb(0.91, 0.16, 0.57); // Magenta pink (#E82991) for branding
    const darkGray = rgb(0.3, 0.3, 0.3);
    const lightGray = rgb(0.6, 0.6, 0.6);
    
    // Add border to the entire page - with fix to ensure it displays correctly
    page.drawRectangle({
      x: 40,
      y: 40,
      width: width - 80,
      height: height - 80,
      borderColor: pinkColor,
      borderWidth: 2,
      opacity: 1, // Ensure full opacity
    });
    
    // Format event time from the time property or use a default
    const eventTime = orderData.eventTime || "2:00 PM - 4:00 PM";
    
    // Format venue details
    const venueName = orderData.location || "Stock Bar Montreal";
    const venueAddress = orderData.venueAddress || "1171 Rue Sainte-Catherine E, Montreal, QC H2L 2G8";
    
    // Generate food service message if included
    const foodServiceIncluded = orderData.includeFoodService;
    
    // Fix event title display (ensure proper encoding for special characters)
    const eventTitle = orderData.eventTitle.replace(/Célineline/g, "Céline").replace(/C.line/g, "Céline");

    // Try to fetch and embed the logo image - with improved error handling and format detection
    let logoImage = null;
    
    // Updated list of URLs to try for logo image, now including .jpeg extension
    const logoUrls = [
      // JPEG (including both .jpg and .jpeg extensions)
      "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/brunch-singalong-logo.jpeg",
      "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/brunch-singalong-logo.jpg",
      // PNG alternatives
      "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/brunch-singalong-logo.png",
      "https://brunchsingalong.com/images/logo.jpeg",
      "https://brunchsingalong.com/images/logo.jpg",
      "https://brunchsingalong.com/images/logo.png",
      "https://brunchsingalong.com/logo.jpeg",
      "https://brunchsingalong.com/logo.jpg",
      "https://brunchsingalong.com/logo.png",
      // General image
      "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/logo.jpeg",
      "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/logo.jpg",
      "https://ywmkycemozecroohrisr.supabase.co/storage/v1/object/public/ticket-assets/logo.png"
    ];
    
    // Try each URL in sequence until we find one that works
    for (const url of logoUrls) {
      try {
        console.log(`Attempting to fetch logo from: ${url}`);
        const logoData = await fetchImageFromUrl(url);
        
        if (logoData && logoData.length > 0) {
          try {
            // Determine if it's a PNG or JPEG based on the URL
            if (url.toLowerCase().endsWith('.png')) {
              logoImage = await pdfDoc.embedPng(logoData);
              console.log(`Successfully embedded PNG logo from URL: ${url}`);
            } else if (url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg')) {
              logoImage = await pdfDoc.embedJpg(logoData);
              console.log(`Successfully embedded JPEG logo from URL: ${url}`);
            } else {
              // Try to guess by trying both formats
              try {
                logoImage = await pdfDoc.embedPng(logoData);
                console.log(`Successfully embedded as PNG from URL: ${url}`);
              } catch (pngError) {
                try {
                  logoImage = await pdfDoc.embedJpg(logoData);
                  console.log(`Successfully embedded as JPEG from URL: ${url}`);
                } catch (jpgError) {
                  console.error(`Could not embed as PNG or JPEG from ${url}`);
                }
              }
            }
            
            if (logoImage) break;
          } catch (embedError) {
            console.error(`Error embedding logo from ${url}:`, embedError);
          }
        }
      } catch (urlError) {
        console.warn(`Failed to fetch from URL ${url}:`, urlError);
      }
    }
    
    // If direct URLs fail, try Supabase storage with all three formats
    if (!logoImage) {
      console.log("Trying to fetch logo from Supabase storage");
      const storagePaths = [
        "brunch-singalong-logo.jpeg",
        "brunch-singalong-logo.jpg",
        "brunch-singalong-logo.png",
        "logo.jpeg",
        "logo.jpg",
        "logo.png"
      ];
      
      for (const path of storagePaths) {
        const logoData = await fetchImageFromStorage(path);
        if (logoData && logoData.length > 0) {
          try {
            if (path.toLowerCase().endsWith('.png')) {
              logoImage = await pdfDoc.embedPng(logoData);
              console.log(`Successfully embedded PNG logo from storage path: ${path}`);
            } else if (path.toLowerCase().endsWith('.jpg') || path.toLowerCase().endsWith('.jpeg')) {
              logoImage = await pdfDoc.embedJpg(logoData);
              console.log(`Successfully embedded JPEG logo from storage path: ${path}`);
            }
            
            if (logoImage) break;
          } catch (embedError) {
            console.error(`Error embedding logo from storage path ${path}:`, embedError);
          }
        }
      }
    }

    // Add logo - FURTHER ENLARGED and better centered
    if (logoImage) {
      console.log("Using embedded logo image in PDF");
      // Further enlarging logo and centering it better
      const logoScale = 2.0; // Increased from 1.5 to 2.0 for an even larger logo
      const logoDims = logoImage.scale(logoScale);
      
      // Calculate dimensions to ensure proper sizing and perfect centering
      const logoWidth = Math.min(450, logoDims.width); // Increased from 400 to 450
      const logoHeight = Math.min(180, logoDims.height); // Increased from 150 to 180
      
      page.drawImage(logoImage, {
        x: (width / 2) - (logoWidth / 2), // Center horizontally
        y: height - 150, // Position higher on page to accommodate larger size
        width: logoWidth,
        height: logoHeight,
      });
    } else {
      // Fallback to text-based logo representation - further enlarged
      console.log("Using text fallback for logo");
      page.drawRectangle({
        x: width / 2 - 225, // Centered larger box
        y: height - 180,
        width: 450, // Increased from 400 to 450
        height: 180, // Increased from 150 to 180
        color: pinkColor,
        borderColor: pinkColor,
        borderWidth: 2,
        borderRadius: 15,
        opacity: 1,
      });
      
      // Add "Brunch Singalong" text in white - enlarged more
      page.drawText("Brunch Singalong", {
        x: width / 2 - helveticaBold.widthOfTextAtSize("Brunch Singalong", 44) / 2, // Increased font size
        y: height - 110, // Adjusted position
        font: helveticaBold,
        size: 44, // Increased from 38 to 44
        color: rgb(1, 1, 1), // White
      });
      
      // Add "Ticket" text in white
      page.drawText("Ticket", {
        x: width / 2 - helveticaBold.widthOfTextAtSize("Ticket", 32) / 2,
        y: height - 70, // Adjusted position
        font: helveticaBold,
        size: 32, // Increased from 28 to 32
        color: rgb(1, 1, 1), // White
      });
    }
    
    // Add Order ID - adjusted position to account for larger logo
    page.drawText(`Order: #${orderData.orderId.slice(0, 8).toUpperCase()}`, {
      x: 60,
      y: height - 220, // Moved down from 200 to 220
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    // Add Ticket Label - adjusted position
    page.drawText("Official Admission Ticket", {
      x: 60,
      y: height - 250, // Moved down from 230 to 250
      font: helveticaBold,
      size: 20,
      color: pinkColor,
    });
    
    // Add Event Title - adjusted position
    page.drawText(eventTitle, {
      x: 60,
      y: height - 280, // Moved down from 260 to 280
      font: helveticaBold,
      size: 18,
      color: darkGray,
    });
    
    // EVENT DETAILS SECTION - adjusted position
    page.drawText("Event Details", {
      x: 60,
      y: height - 320, // Moved down from 300 to 320
      font: helveticaBold,
      size: 16,
      color: darkGray,
    });
    
    page.drawText(`Date: ${orderData.eventDate}`, {
      x: 80,
      y: height - 340, // Moved down from 320 to 340
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    page.drawText(`Time: ${eventTime}`, {
      x: 80,
      y: height - 360, // Moved down from 340 to 360
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    page.drawText(`Venue: ${venueName}`, {
      x: 80,
      y: height - 380, // Moved down from 360 to 380
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    page.drawText(`Address: ${venueAddress}`, {
      x: 80,
      y: height - 400, // Moved down from 380 to 400
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    // TICKET INFORMATION SECTION - adjusted position
    page.drawText("Ticket Information", {
      x: 60,
      y: height - 440, // Moved down from 420 to 440
      font: helveticaBold,
      size: 16,
      color: darkGray,
    });
    
    page.drawText(`Type: ${orderData.ticketType} Tickets`, {
      x: 80,
      y: height - 460, // Moved down from 440 to 460
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    page.drawText(`Quantity: ${orderData.quantity}`, {
      x: 80,
      y: height - 480, // Moved down from 460 to 480
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    page.drawText(`Price: $${orderData.ticketPrice} each`, {
      x: 80,
      y: height - 500, // Moved down from 480 to 500
      font: helvetica,
      size: 12,
      color: darkGray,
    });
    
    // FOOD SERVICE SECTION - adjusted position
    page.drawText("Food Service", {
      x: 60,
      y: height - 540, // Moved down from 520 to 540
      font: helveticaBold,
      size: 16,
      color: darkGray,
    });
    
    if (foodServiceIncluded) {
      page.drawText("Premium Buffet Service Included", {
        x: 80,
        y: height - 560, // Moved down from 540 to 560
        font: helvetica,
        size: 12,
        color: darkGray,
      });
      
      page.drawText("Food Service Time: 12:30 PM - 2:00 PM", {
        x: 80,
        y: height - 580, // Moved down from 560 to 580
        font: helvetica,
        size: 12,
        color: darkGray,
      });
    } else {
      page.drawText("No Food Service", {
        x: 80,
        y: height - 560, // Moved down from 540 to 560
        font: helvetica,
        size: 12,
        color: darkGray,
      });
    }
    
    // IMPORTANT INSTRUCTIONS SECTION - adjusted position
    page.drawText("Important Instructions:", {
      x: 60,
      y: height - 620, // Moved down from 600 to 620
      font: helveticaBold,
      size: 14,
      color: darkGray,
    });
    
    page.drawText("Please bring this ticket with you (printed or on your phone)", {
      x: 80,
      y: height - 640, // Moved down from 620 to 640
      font: helvetica,
      size: 10,
      color: darkGray,
    });
    
    page.drawText("Doors open 30 minutes before show time", {
      x: 80,
      y: height - 660, // Moved down from 640 to 660
      font: helvetica,
      size: 10,
      color: darkGray,
    });
    
    page.drawText("For questions, contact tickets@brunchsingalong.com", {
      x: 80,
      y: height - 680, // Moved down from 660 to 680
      font: helvetica,
      size: 10,
      color: darkGray,
    });
    
    // Add QR code and related content
    let qrImage;
    try {
      // Try to generate QR code using external service
      console.log("Generating QR code via API service");
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(orderData.orderId)}`;
      
      const qrResponse = await fetch(qrCodeUrl);
      
      if (qrResponse.ok) {
        const qrImageData = await qrResponse.arrayBuffer();
        qrImage = await pdfDoc.embedPng(new Uint8Array(qrImageData));
        console.log("QR code embedded successfully from API service");
      } else {
        console.log("Failed to fetch QR code from API, will use placeholder");
      }
    } catch (error) {
      console.warn("Failed to generate QR code, falling back to placeholder:", error);
    }
    
    // Add the QR code - either real or placeholder
    const qrSize = 110;
    if (qrImage) {
      page.drawImage(qrImage, {
        x: width - qrSize - 60,
        y: 150,
        width: qrSize,
        height: qrSize,
      });
    } else {
      // Fallback to a QR code placeholder
      page.drawRectangle({
        x: width - qrSize - 60,
        y: 150,
        width: qrSize,
        height: qrSize,
        borderColor: darkGray,
        borderWidth: 1,
        color: rgb(0.95, 0.95, 0.95),
        opacity: 1, // Ensure full opacity
      });
      
      // Add some patterns to simulate QR code data points
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if ((i + j) % 2 === 0) {
            page.drawRectangle({
              x: width - qrSize - 60 + (i * qrSize/5) + 2,
              y: 150 + (j * qrSize/5) + 2,
              width: qrSize/5 - 4,
              height: qrSize/5 - 4,
              color: darkGray,
              opacity: 1, // Ensure full opacity
            });
          }
        }
      }
    }
    
    // Add the QR code label
    page.drawText(`Order #${orderData.orderId.slice(0, 8).toUpperCase()}`, {
      x: width - qrSize - 60 + qrSize/2 - helvetica.widthOfTextAtSize(`Order #${orderData.orderId.slice(0, 8).toUpperCase()}`, 8) / 2,
      y: 140,
      font: helvetica,
      size: 8,
      color: darkGray,
    });
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    console.log("PDF ticket generated successfully with size:", pdfBytes.length);
    return pdfBytes;
    
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
}
