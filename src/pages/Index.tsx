
import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

// Critical components that should be loaded immediately
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import About from '@/components/About';

// Non-critical components that can be lazy loaded
const PricingSection = lazy(() => import('@/components/PricingSection'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const Contact = lazy(() => import('@/components/Contact'));
const Newsletter = lazy(() => import('@/components/Newsletter'));
const Footer = lazy(() => import('@/components/Footer'));
const FloatingButton = lazy(() => import('@/components/FloatingButton'));
const Merchandise = lazy(() => import('@/components/Merchandise'));
const FAQ = lazy(() => import('@/components/FAQ'));

const SectionLoader = () => (
  <div className="py-12 flex justify-center items-center">
    <Loader2 className="h-6 w-6 animate-spin text-brunch-purple" />
  </div>
);

const Index = () => {
  console.log("Index page rendering started");
  
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Events />
      <About />
      
      <Suspense fallback={<SectionLoader />}>
        <PricingSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Merchandise />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Newsletter />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={null}>
        <FloatingButton />
      </Suspense>
      
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Index;
