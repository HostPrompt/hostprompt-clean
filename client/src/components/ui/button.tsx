import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', size = 'md', variant = 'primary', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    
    const variantClasses = {
      primary: 'bg-[#FF5C5C] text-white hover:bg-[#FF7070]',
      secondary: 'bg-white border border-[#FF5C5C] text-[#FF5C5C] hover:bg-[#FFF6F6]',
      ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100'
    };
    
    return (
      <button
        ref={ref}
        className={`${sizeClasses[size]} ${variantClasses[variant]} font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:ring-opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';