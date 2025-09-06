
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const Refund = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6 shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Refund Policy</h1>
          
          <CardContent className="prose max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Ticket Refunds</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All tickets are final sale.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In the event of a postponement tickets for the new date will be issued. In the event of a show cancellations refunds will be available.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any refund-related inquiries, please contact us at:{' '}
                <a href="mailto:tickets@brunchsingalong.com" className="text-primary hover:underline">
                  tickets@brunchsingalong.com
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

export default Refund;
