import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Home from './Home';

/**
 * Dashboard component that serves as a wrapper for the Home component
 * Specifically designed to handle access tokens in the URL
 */
export default function Dashboard() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Check if there's an access_token in the URL
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('access_token');
    
    if (accessToken) {
      console.log('Found access token in URL, saving to localStorage');
      
      // Create a token object with expiry time (24 hours from now)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      const tokenData = {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 24 * 60 * 60, // 24 hours in seconds
        expiry_time: expiryTime
      };
      
      // Save token to localStorage
      localStorage.setItem('outseta_token_data', JSON.stringify(tokenData));
      
      // Flag that we're authenticated in sessionStorage
      sessionStorage.setItem('authenticated', 'true');
      
      // Clean up the URL by removing the access_token parameter
      navigate('/app', { replace: true });
    }
  }, [navigate]);
  
  // Render the Home component
  return <Home mobileMenuOpen={false} setMobileMenuOpen={() => {}} />;
}