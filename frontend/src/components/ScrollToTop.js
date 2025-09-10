import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Log for debugging
    console.log('ScrollToTop: Route changed to:', pathname);
    console.log('ScrollToTop: Current scroll position before reset:', window.pageYOffset);
    
    // Multiple approaches to ensure scroll to top works
    
    // Method 1: Immediate scroll
    window.scrollTo(0, 0);
    
    // Method 2: Scroll after a short delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log('ScrollToTop: After timeout reset, scroll position:', window.pageYOffset);
    }, 0);
    
    // Method 3: Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      console.log('ScrollToTop: After requestAnimationFrame reset, scroll position:', window.pageYOffset);
    });
    
  }, [pathname]);

  return null;
}

export default ScrollToTop;