import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    // Redirect users to Squarespace for authentication
    console.log('Redirecting to Squarespace for authentication');
    window.location.href = 'https://www.hostprompt.com';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Redirecting to Login...
        </h2>
        <p className="text-gray-600">
          Taking you to our secure login page.
        </p>
      </div>
    </div>
  );
}