
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { 
            email: email.toLowerCase().trim(),
            created_at: new Date().toISOString() // Convert Date to string
          }
        ]);

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          toast.error('This email is already subscribed to our newsletter');
        } else {
          throw error;
        }
      } else {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail(''); // Clear the input
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-brunch-light">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Stay in the Loop!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Get exclusive updates on new events, special offers, and behind-the-scenes content.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isLoading}
            required
          />
          <Button 
            type="submit" 
            className="bg-brunch-pink hover:bg-brunch-purple text-white px-8"
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
