import { useEffect, useState } from 'react';
import { getUserIdString } from '@/lib/userId';

// Flag to control whether UAT mode is active
const IS_UAT = true;

export function UATIndicator() {
  const [userId, setUserId] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(true); // Start minimized by default

  // Get the user ID from localStorage on component mount
  useEffect(() => {
    if (IS_UAT) {
      const id = getUserIdString();
      setUserId(id);
    }
  }, []);

  // Don't render anything if not in UAT mode or if userId is not yet loaded
  if (!IS_UAT || !userId) {
    return null;
  }

  // Show a shortened version of the user ID for better UI
  const shortUserId = userId.length > 12 ? 
    `${userId.substring(0, 8)}...${userId.substring(userId.length - 4)}` : 
    userId;

  // Toggle between minimized and expanded states
  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  return (
    <div 
      className={`
        fixed bottom-16 md:bottom-3 right-3 bg-black/70 text-white text-xs
        rounded-lg z-50 font-mono leading-snug shadow-md transition-all duration-300
        ${minimized ? 'py-1.5 px-2' : 'py-2 px-2.5'}
        cursor-pointer
      `}
      onClick={toggleMinimized}
    >
      {minimized ? (
        <div className="flex items-center">
          <span>🧪</span>
        </div>
      ) : (
        <>
          🧪 Testing Mode (UAT)<br/>
          User ID: {shortUserId}
        </>
      )}
    </div>
  );
}

export default UATIndicator;