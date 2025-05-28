import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: Checking authentication');
    const token = localStorage.getItem('access_token');
    
    if (token) {
      console.log('ProtectedRoute: Token found, user authenticated');
      setIsAuthenticated(true);
    } else {
      console.log('ProtectedRoute: No token found, redirecting to /login');
      setLocation('/login');
    }
    
    setIsChecking(false);
  }, [setLocation]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Checking Authentication...
          </h2>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}