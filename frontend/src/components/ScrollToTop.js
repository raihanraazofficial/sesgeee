import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes
    // Use requestAnimationFrame to ensure DOM is updated first
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