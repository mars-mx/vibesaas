'use client';

import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils/cn";

interface ScrollProgressBarProps {
  className?: string;
  height?: string | number;
  gradient?: boolean;
  colors?: {
    from?: string;
    to?: string;
  };
  position?: 'top' | 'bottom';
}

export function ScrollProgressBar({
  className,
  height = 4,
  gradient = true,
  colors = {
    from: "#f2401b", // Using actual color instead of CSS variable
    to: "#f5732f"
  },
  position = 'top'
}: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const winScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollableHeight = scrollHeight - clientHeight;
      
      if (scrollableHeight > 0) {
        const scrolled = (winScroll / scrollableHeight) * 100;
        setProgress(Math.min(Math.max(scrolled, 0), 100));
      }
    };

    // Initial calculation
    updateProgress();
    
    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const heightValue = typeof height === 'number' ? `${height}px` : height;
  
  const backgroundStyle = gradient
    ? { background: `linear-gradient(90deg, ${colors.from} 0%, ${colors.to} 100%)` }
    : { backgroundColor: colors.from };

  const positionClasses = position === 'top' 
    ? 'top-0' 
    : 'bottom-0';

  return (
    <div
      className={cn(
        "fixed left-0 z-50 transition-transform duration-200 ease-out",
        positionClasses,
        className
      )}
      style={{
        ...backgroundStyle,
        height: heightValue,
        width: `${progress}%`,
        transform: `translateZ(0)`, // Force GPU acceleration
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}