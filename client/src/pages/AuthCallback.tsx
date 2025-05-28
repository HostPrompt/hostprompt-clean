import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log("🔁 AuthCallback: Page loaded");
    console.log('🔍 Full URL:', window.location.href);
    console.log('🔍 Hash:', window.location.hash);
    console.log('🔍 Search:', window.location.search);
    console.log('🔍 Pathname:', window.location.pathname);

    // First try to get from URL search params (?access_token=...)
    const searchParams = new URLSearchParams(window.location.search);
    let token = searchParams.get('access_token');
    
    console.log('🔍 Checking search params for access_token...');
    if (token) {
      console.log('✅ Token found in search params:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ No token in search params');
    }

    // Fallback to hash params (#access_token=...)
    if (!token && window.location.hash) {
      console.log('🔍 Checking hash params for access_token...');
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      token = hashParams.get('access_token');
      if (token) {
        console.log('✅ Token found in hash params:', token.substring(0, 20) + '...');
      } else {
        console.log('❌ No token in hash params');
      }
    }

    // Additional fallback - check for token in different formats
    if (!token) {
      console.log('🔍 Trying alternative token extraction methods...');
      
      // Try extracting from full URL string
      const fullUrl = window.location.href;
      const accessTokenMatch = fullUrl.match(/access_token=([^&\#]+)/);
      if (accessTokenMatch) {
        token = accessTokenMatch[1];
        console.log('✅ Token found via regex:', token.substring(0, 20) + '...');
      }
    }

    if (token) {
      try {
        localStorage.setItem('access_token', token);
        console.log("✅ Token saved successfully to localStorage");
        console.log('🔍 Verification - localStorage.getItem result:', localStorage.getItem('access_token')?.substring(0, 20) + '...');
        console.log('🚀 Navigating to /app');
        setLocation('/app');
      } catch (error) {
        console.error('❌ Failed to save token to localStorage:', error);
        setLocation('/login');
      }
    } else {
      console.error("❌ No access token found anywhere in URL");
      console.log('🔍 Available search params:', Array.from(searchParams.entries()));
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        console.log('🔍 Available hash params:', Array.from(hashParams.entries()));
      }
      console.log('🔍 Raw URL breakdown:');
      console.log('  - Origin:', window.location.origin);
      console.log('  - Pathname:', window.location.pathname); 
      console.log('  - Search:', window.location.search);
      console.log('  - Hash:', window.location.hash);
      setLocation('/login');
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Sign In...
        </h2>
        <p className="text-gray-600">
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
}