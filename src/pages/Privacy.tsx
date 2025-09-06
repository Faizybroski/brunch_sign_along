import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6 shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Privacy Policy</h1>
          
          <CardContent className="prose max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Brunch Sing Along. Your privacy is important to us, and we are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase tickets.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We may collect personal information that you voluntarily provide when purchasing tickets or interacting with our website, including:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Name
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Email address
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Phone number
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Birthdate
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Payment details (processed securely by third-party payment providers)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Any other information you provide when contacting us
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use your information for the following purposes:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  To process ticket purchases and transactions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  To send event confirmations and updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  To provide customer support
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  To improve our website and services
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  To comply with legal obligations
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">4. Sharing Your Information</h2>
              <p className="text-muted-foreground">
                We do not sell or rent your personal information. However, we may share your information with:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Third-party payment processors to complete transactions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Email service providers to send confirmations and updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Legal authorities if required by law
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal data. However, no online transaction is 100% secure. Please take precautions when sharing sensitive information online.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">6. Cookies & Tracking Technologies</h2>
              <p className="text-muted-foreground">
                We may use cookies and similar technologies to enhance user experience, track website traffic, and improve our services. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">7. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Access, update, or delete your personal information
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Opt out of marketing communications
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  Request information about how we process your data
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us at:{' '}
                <a href="mailto:tickets@BrunchSingAlong.com" className="text-brunch-purple hover:underline">
                  tickets@BrunchSingAlong.com
                </a>
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:{' '}
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

export default Privacy;
