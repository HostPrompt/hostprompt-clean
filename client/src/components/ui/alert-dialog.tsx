import React from 'react';

// Main AlertDialog component
export const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  return children;
};

// AlertDialog Title component
export const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-xl font-semibold mb-2">{children}</h2>;
};

// AlertDialog Description component
export const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-neutral-600 mb-4">{children}</p>;
};

// AlertDialog Content component
export const AlertDialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// AlertDialog Header component
export const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

// AlertDialog Footer component
export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-end space-x-3 mt-6">{children}</div>;
};

// AlertDialog Action component
export const AlertDialogAction = ({ 
  children, 
  className = '',
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// AlertDialog Cancel component
export const AlertDialogCancel = ({ 
  children, 
  className = '',
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple standalone AlertDialog component (for backward compatibility)
interface SimpleAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const SimpleAlertDialog: React.FC<SimpleAlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  variant = 'info'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    warning: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    info: 'bg-[#FFECEC] text-[#FF5C5C] hover:bg-[#FFE0E0]'
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
        <AlertDialogAction 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={variantClasses[variant]}
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default SimpleAlertDialog;