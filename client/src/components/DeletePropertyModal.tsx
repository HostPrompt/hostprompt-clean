import React from 'react';

interface DeletePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePropertyModal({ isOpen, onClose, onConfirm }: DeletePropertyModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Delete Property</h2>
            <p className="text-neutral-600 mb-4">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C] bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}