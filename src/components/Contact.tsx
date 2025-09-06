
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Phone, MapPin, SendIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    const toastId = toast.loading("Sending your message...");
    
    try {
      console.log("Submitting contact form data:", data);
      const { data: responseData, error } = await supabase.functions.invoke("send-contact-message", {
        body: data
      });

      console.log("Contact form response:", responseData, error);

      if (error) {
        console.error("Error submitting contact form:", error);
        toast.dismiss(toastId);
        toast.error("Failed to send your message. Please try again later.");
        return;
      }

      // Check for warnings in the response
      if (responseData?.warning) {
        console.warn("Contact form warning:", responseData.warning);
        toast.dismiss(toastId);
        toast.warning(responseData.message || "Your message was received but there may be delays in our response.");
      } else {
        // Reset the form on successful submission
        form.reset();
        toast.dismiss(toastId);
        toast.success("Your message has been sent successfully! We'll get back to you soon.");
      }
      
      console.log("Contact form submitted successfully:", responseData);
    } catch (err) {
      console.error("Error in contact form submission:", err);
      toast.dismiss(toastId);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-brunch-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Get in <span className="font-dancing text-brunch-purple">Touch</span></h2>
          <div className="w-20 h-1 bg-brunch-blue mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Questions about our events?<br />
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@example.com" 
                              type="email"
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="I'd like to know more about..." 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your message here..." 
                            rows={5}
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-brunch-purple hover:bg-brunch-purple-dark text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendIcon className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          <div>
            <div className="bg-brunch-purple text-white rounded-xl p-8 shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="mt-1">tickets@brunchsingalong.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="mt-1">514-500-4146 ext 800</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold">Venue</h4>
                    <p className="mt-1 text-white/90">Stock Bar</p>
                    <p className="mt-1">1171 St Catherine St E<br />Montreal, Quebec</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
