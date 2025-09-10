import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple approaches to ensure scroll to top works reliably
    
    // Method 1: Immediate scroll
    window.scrollTo(0, 0);
    
    // Method 2: Scroll after a short delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    
    // Method 3: Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    });
    
  }, [pathname]);

  return null;
}

export default ScrollToTop;