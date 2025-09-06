
import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldShowLogo, setShouldShowLogo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle clicks outside of mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      if (isHomePage) {
        setShouldShowLogo(scrollPosition > 100);
      } else {
        setShouldShowLogo(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleContactClick = () => {
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleEventsClick = () => {
    if (isHomePage) {
      const upcomingEventsSection = document.getElementById('upcoming-events');
      if (upcomingEventsSection) {
        upcomingEventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/events');
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            alt="Brunch Singalong" 
            className={`h-12 transition-opacity duration-300 ${shouldShowLogo ? 'opacity-100' : 'opacity-0'}`}
            src="/lovable-uploads/00434fb5-e50b-4636-ac2a-6ecd80819866.png" 
          />
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-brunch-purple transition-colors">Home</Link>
          <button 
            onClick={handleContactClick}
            className="font-medium hover:text-brunch-purple transition-colors"
          >
            Contact
          </button>
          <Button asChild className="bg-brunch-purple hover:bg-brunch-purple-dark text-white">
            <button onClick={handleEventsClick}>Buy Tickets</button>
          </Button>
        </div>
        
        <Button 
          ref={menuButtonRef}
          variant="ghost" 
          className="md:hidden hover:bg-brunch-pink hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="hover:text-brunch-pink" />
        </Button>
      </div>
      
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="font-medium hover:text-brunch-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <button
              onClick={() => {
                handleContactClick();
                setIsMobileMenuOpen(false);
              }}
              className="font-medium hover:text-brunch-purple transition-colors text-left"
            >
              Contact
            </button>
            <Button 
              className="bg-brunch-purple hover:bg-brunch-purple-dark text-white w-full"
              onClick={() => {
                handleEventsClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Buy Tickets
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
