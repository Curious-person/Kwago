'use client';

import { useEffect, useState } from 'react';

/**
 * A minimalist reading progress bar that tracks the user's scroll position.
 * Fixed to the top of the viewport for constant visibility.
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrollHeight = documentHeight - windowHeight;
      
      if (scrollHeight > 0) {
        const percentage = (scrollTop / scrollHeight) * 100;
        setProgress(Math.min(100, Math.max(0, percentage)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div 
        className="h-full bg-[#0066FF] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
