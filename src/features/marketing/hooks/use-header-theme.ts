'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseHeaderThemeOptions {
  /**
   * How often to check the background in milliseconds
   * @default 100
   */
  checkInterval?: number;
  
  /**
   * Luminance threshold (0-1) below which background is considered dark
   * @default 0.5
   */
  darkThreshold?: number;
}

export function useHeaderTheme(options: UseHeaderThemeOptions = {}) {
  const {
    checkInterval = 100,
    darkThreshold = 0.5
  } = options;

  const [isOverDark, setIsOverDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>();
  const lastCheckTime = useRef(0);

  const calculateLuminance = useCallback((r: number, g: number, b: number): number => {
    // Convert to relative luminance (0-1)
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;
    
    const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }, []);

  const checkElementBelowHeader = useCallback(() => {
    const header = headerRef.current;
    if (!header) return;

    // Get header position and dimensions
    const headerRect = header.getBoundingClientRect();
    const checkY = headerRect.bottom + 10; // Check 10px below header
    const checkX = window.innerWidth / 2; // Check at center horizontally

    // Get element at the check point
    const element = document.elementFromPoint(checkX, checkY);
    if (!element) return;

    // Walk up the DOM tree to find an element with a background
    let currentElement: Element | null = element;
    let isDark = false;

    while (currentElement && currentElement !== document.body) {
      const computedStyle = window.getComputedStyle(currentElement);
      const backgroundColor = computedStyle.backgroundColor;
      
      // Check for explicit dark data attribute
      if (currentElement.hasAttribute('data-header-theme')) {
        isDark = currentElement.getAttribute('data-header-theme') === 'dark';
        break;
      }

      // Check if element has a non-transparent background color
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
        // Parse RGB values
        const matches = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (matches) {
          const r = parseInt(matches[1]);
          const g = parseInt(matches[2]);
          const b = parseInt(matches[3]);
          const luminance = calculateLuminance(r, g, b);
          isDark = luminance < darkThreshold;
          break;
        }
      }

      // Check for dark class names
      const darkClasses = ['bg-dark', 'dark-bg', 'bg-slate-900', 'bg-gray-900', 'bg-black', 'bg-zinc-900', 'bg-neutral-900'];
      if (darkClasses.some(cls => currentElement!.classList.contains(cls))) {
        isDark = true;
        break;
      }

      // Move up to parent
      currentElement = currentElement.parentElement;
    }

    setIsOverDark(isDark);
  }, [calculateLuminance, darkThreshold]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const animate = (timestamp: number) => {
      // Throttle checks based on interval
      if (timestamp - lastCheckTime.current >= checkInterval) {
        checkElementBelowHeader();
        lastCheckTime.current = timestamp;
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    // Also check on scroll for immediate updates
    const handleScroll = () => {
      checkElementBelowHeader();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [checkInterval, checkElementBelowHeader]);

  return {
    isOverDark,
    headerRef
  };
}