import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6 shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Terms & Conditions</h1>
          
          <CardContent className="prose max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Brunch Sing Along. By purchasing tickets and using our website, you agree to abide by these Terms and Conditions. Please read them carefully before proceeding.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">2. Ticket Purchases</h2>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  All ticket sales are final and non-transferable unless explicitly stated.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Tickets must be purchased through our official website or authorized partners.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  The ticket holder must present a valid ID upon entry if required.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">3. Event Policies</h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>We reserve the right to modify or cancel an event due to unforeseen circumstances.</li>
                <li>Attendees must comply with venue rules and local regulations.</li>
                <li>Any disruptive behavior may result in removal without a refund.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">4. Refund and Cancellation Policy</h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Tickets are non-refundable except in cases of event cancellation or rescheduling.</li>
                <li>Any refund requests must be submitted as per our Refund Policy.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">5. Liability Disclaimer</h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Brunch Sing Along is not responsible for lost or stolen tickets.</li>
                <li>We are not liable for any injuries, damages, or losses incurred during the event.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">6. Privacy Policy</h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Personal information collected during ticket purchases is handled according to our Privacy Policy.</li>
                <li>We do not share personal data with third parties without consent.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">7. Changes to Terms</h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>We reserve the right to update these Terms and Conditions at any time.</li>
                <li>Any changes will be posted on our website with an updated effective date.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">8. Contact Us</h2>
              <p className="text-gray-600">
                For any questions or concerns, please contact us at:{' '}
                <a href="mailto:tickets@BrunchSingAlong.com" className="text-brunch-purple hover:underline">
                  tickets@BrunchSingAlong.com
                </a>
              </p>
            </section>
          </CardContent>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="hover:bg-primary/10">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
