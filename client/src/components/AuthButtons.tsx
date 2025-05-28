import React from 'react';

interface AuthButtonsProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function AuthButtons({ className = '', variant = 'primary' }: AuthButtonsProps) {
  const buttonClasses = 'inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#FF5C5C] hover:bg-[#FF3C3C] transition-colors min-w-[100px]';

  const handleLogin = () => {
    const loginUrl = 'https://hostprompt-ai.outseta.com/auth?widgetMode=login&redirect_uri=https://app.hostprompt.com/auth/callback#o-anonymous';
    window.location.href = loginUrl;
  };

  const handleSignup = () => {
    const signupUrl = 'https://hostprompt-ai.outseta.com/auth?widgetMode=register&planUid=79Oba5QE&planPaymentTerm=month&skipPlanOptions=false&redirect_uri=https://app.hostprompt.com/auth/callback#o-anonymous';
    window.location.href = signupUrl;
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {variant === 'primary' ? (
        <>
          <button
            className="inline-flex items-center justify-center px-6 py-2 border border-[#FF5C5C] text-base font-medium rounded-full text-[#FF5C5C] bg-white hover:bg-neutral-50 transition-colors min-w-[100px]"
            onClick={handleLogin}
          >
            Log In
          </button>
          <button
            className={buttonClasses}
            onClick={handleSignup}
          >
            Get Started
          </button>
        </>
      ) : (
        <>
          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white hover:text-neutral-200 transition-colors"
            onClick={handleLogin}
          >
            Log In
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-white text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors"
            onClick={handleSignup}
          >
            Get Started
          </button>
        </>
      )}
    </div>
  );
}