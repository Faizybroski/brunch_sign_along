import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Hero = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  // Use fully qualified URLs for better sharing
  const heroImage = "/lovable-uploads/a05d115e-26c1-4c06-811e-112d90e831e7.png";
  const logoImage = "/lovable-uploads/6d4454ce-bffb-4453-a658-fc731e5eaa07.png";
  const socialShareImage = "/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png";
  const trailerVideoUrl = "https://player.vimeo.com/video/76979871?autoplay=1&muted=1&loop=1&background=1";

  // Preload critical images
  useEffect(() => {
    const logo = new Image();
    logo.src = logoImage;
    logo.onload = () => setLogoLoaded(true);

    const hero = new Image();
    hero.src = heroImage;
    hero.onload = () => setHeroImageLoaded(true);

    // Also preload social share image
    const social = new Image();
    social.src = socialShareImage;
  }, []);

  const scrollToEvents = () => {
    const upcomingEventsSection = document.getElementById('upcoming-events');
    if (upcomingEventsSection) {
      const headerOffset = 100; // Offset to show the section heading
      const elementPosition = upcomingEventsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Add structured data for better SEO and social media previews
  useEffect(() => {
    // Ensure we don't duplicate the structured data
    const existingScript = document.getElementById('brunch-structured-data');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'brunch-structured-data';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Brunch Sing Along",
      "description": "Montreal's #1 Musical Brunch Experience",
      "image": "https://brunchsingalong.lovable.app/lovable-uploads/ecedff7e-4b3d-4806-bdcb-30ae7a128543.png",
      "performer": {
        "@type": "PerformingGroup",
        "name": "Brunch Sing Along"
      },
      "offers": {
        "@type": "Offer",
        "price": "39",
        "priceCurrency": "CAD",
        "availability": "https://schema.org/InStock"
      }
    });

    document.head.appendChild(script);

    // Clean up function
    return () => {
      const scriptToRemove = document.getElementById('brunch-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <section id="hero" className="relative flex items-start bg-gradient-to-b from-brunch-purple-light to-white pt-12 pb-8">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-between gap-8">
          <div className="text-center w-full mb-6">
            <div className="h-40 mb-4 mx-auto relative">
              {!logoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brunch-purple" />
                </div>
              )}
              <img
                alt="Brunch Singalong Logo"
                src={logoImage}
                className={`h-40 mx-auto object-cover transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLogoLoaded(true)}
                loading="eager"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-4 bg-gradient-to-r from-accent via-brunch-purple to-accent bg-clip-text text-transparent drop-shadow-sm">
              Montreal's #1
              <span className="block font-dancing text-brunch-purple mt-2 text-5xl md:text-7xl">
                Brunch Experience
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={scrollToEvents}
                className="bg-brunch-purple hover:bg-brunch-purple-dark text-white text-lg"
              >
                Book Your Spot
              </Button>
              <AlertDialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-lg border-2 border-brunch-purple text-brunch-purple hover:bg-brunch-purple hover:text-white">
                    Watch Trailer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-dancing text-brunch-purple">Brunch Singalong Trailer</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      <iframe
                        src={isVideoOpen ? trailerVideoUrl : ""}
                        className="w-full aspect-video rounded-md"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        title="Brunch Singalong Trailer"
                      />

                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-brunch-purple text-brunch-purple hover:bg-brunch-purple-light">Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

         <div className="w-full max-w-5xl mx-auto mb-4">
  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
    <iframe
      src="https://player.vimeo.com/video/76979871?autoplay=1&muted=1&loop=1&background=1"
      className="w-full h-full object-cover rounded-2xl"
      allow="autoplay; fullscreen"
      allowFullScreen
      loading="lazy"
      title="Brunch Singalong Trailer"
    />

    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="rounded-full size-16 flex items-center justify-center border-4 border-white bg-white/20 hover:bg-white/40 text-white">
            <Play className="size-8 ml-1" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-dancing text-brunch-purple">Brunch Singalong Trailer</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <iframe
                src="https://player.vimeo.com/video/76979871?autoplay=1&muted=1&loop=1"
                className="w-full aspect-video rounded-md"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
                title="Brunch Singalong Trailer"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-brunch-purple text-brunch-purple hover:bg-brunch-purple-light">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
