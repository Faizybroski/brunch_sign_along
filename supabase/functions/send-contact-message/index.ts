
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Initialize the Resend client with the API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
console.log("RESEND_API_KEY present:", !!resendApiKey);
console.log("API key prefix:", resendApiKey ? resendApiKey.substring(0, 4) + "..." : "not set");

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Contact form submission received");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const formData: ContactFormData = await req.json();
    const { name, email, subject, message } = formData;
    
    console.log("Form data received:", { name, email, subject, messageLength: message?.length });

    if (!name || !email || !subject || !message) {
      console.error("Missing required fields in contact form submission");
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store contact message in database
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, subject, message }]);

    if (dbError) {
      console.error("Error saving contact message to database:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save message" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    console.log("Message saved to database successfully");

    // Validate Resend API key
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not set in environment variables");
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: "Email delivery not configured",
          message: "Your message has been saved but email delivery is not configured." 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);

    // Send notification email to admin
    console.log("Sending admin notification email...");
    let adminEmailSent = false;
    try {
      const adminEmailResult = await resend.emails.send({
        from: "Brunch Sing Along <onboarding@resend.dev>", // Using Resend's default domain until custom domain is verified
        to: ["tickets@brunchsingalong.com"],
        subject: `New Contact Form: ${subject}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
      
      if (adminEmailResult.error) {
        console.error("Error from Resend API (admin email):", adminEmailResult.error);
      } else {
        console.log("Admin email sent successfully:", adminEmailResult);
        adminEmailSent = true;
      }
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      console.error("Error details:", typeof emailError === 'object' ? JSON.stringify(emailError) : String(emailError));
    }

    // Send confirmation email to user
    console.log("Sending user confirmation email...");
    let userEmailSent = false;
    try {
      const userEmailResult = await resend.emails.send({
        from: "Brunch Sing Along <onboarding@resend.dev>", // Using Resend's default domain until custom domain is verified
        to: [email],
        subject: "We've received your message!",
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We've received your message about "${subject}" and will get back to you as soon as possible.</p>
          <p>For your reference, here's a copy of your message:</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p>Best regards,<br>The Brunch Sing Along Team</p>
        `,
      });
      
      if (userEmailResult.error) {
        console.error("Error from Resend API (user email):", userEmailResult.error);
      } else {
        console.log("User confirmation email sent successfully:", userEmailResult);
        userEmailSent = true;
      }
    } catch (emailError) {
      console.error("Error sending user confirmation email:", emailError);
      console.error("Error details:", typeof emailError === 'object' ? JSON.stringify(emailError) : String(emailError));
    }

    // Return appropriate response based on email sending results
    if (!adminEmailSent && !userEmailSent) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: "Email delivery failed",
          message: "Your message has been saved but we encountered an issue sending confirmation emails. Our team has been notified." 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Your message has been sent successfully!",
        emailStatus: {
          adminEmailSent,
          userEmailSent
        }
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error in send-contact-message function:", error);
    console.error("Stack trace:", error.stack || "(No stack trace available)");
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
