
import { useState, useEffect } from 'react';

export const useConfetti = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log("Setting up intersection observer for confetti");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log("Musical journey section is visible, triggering confetti");
            setShowConfetti(true);
            setTimeout(() => {
              console.log("Stopping confetti");
              setShowConfetti(false);
            }, 5000);
          }
        });
      },
      { threshold: 0.3 }
    );

    setTimeout(() => {
      const target = document.getElementById('musical-journey');
      if (target) {
        console.log("Found musical journey section, observing");
        observer.observe(target);
      } else {
        console.log("Musical journey section not found");
      }
    }, 500);

    return () => {
      const target = document.getElementById('musical-journey');
      if (target) observer.unobserve(target);
    };
  }, []);

  return { showConfetti, windowSize };
};
