'use client';

import { useEffect, useRef, useState, useTransition, memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const easingFunctions = {
  linear: (t: number) => t,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number) => 
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
} as const;

type EasingFunction = keyof typeof easingFunctions;

const counterVariants = cva(
  'inline-flex items-center justify-center tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'text-2xl md:text-3xl font-semibold',
        md: 'text-4xl md:text-5xl font-bold',
        lg: 'text-6xl md:text-7xl font-black',
        hero: 'text-7xl md:text-8xl lg:text-9xl font-black'
      },
      variant: {
        default: 'text-foreground',
        primary: 'text-primary',
        gradient: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
        glow: 'text-primary drop-shadow-[0_0_20px_rgba(var(--primary)/0.5)]',
        urgent: 'text-destructive animate-pulse'
      }
    },
    defaultVariants: {
      size: 'lg',
      variant: 'gradient'
    }
  }
);

export interface AnimatedCounterProps 
  extends VariantProps<typeof counterVariants> {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onStart?: () => void;
  onComplete?: () => void;
  autoStart?: boolean;
  preserveValue?: boolean;
  announceInterval?: number;
  ariaLabel?: string;
}

const formatNumber = (
  num: number | undefined, 
  decimals: number, 
  separator?: string
): string => {
  // Handle undefined or invalid numbers
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  
  const fixed = num.toFixed(decimals);
  if (!separator) return fixed;
  
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

export const AnimatedCounter = memo(({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  easing = 'easeOutQuart',
  separator = ',',
  decimals = 0,
  prefix = '',
  suffix = '',
  size,
  variant,
  className,
  onStart,
  onComplete,
  autoStart = true,
  preserveValue = true,
  announceInterval = 10,
  ariaLabel = 'Counter'
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(preserveValue ? from : to);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const completedRef = useRef(false);
  const lastAnnouncedRef = useRef(from);

  useEffect(() => {
    if (!autoStart) return;

    const startAnimation = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setIsAnimating(true);
      onStart?.();

      if (prefersReducedMotion) {
        setDisplayValue(to);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easingFunctions[easing](progress);
        const currentValue = from + (to - from) * easedProgress;

        startTransition(() => {
          setDisplayValue(currentValue);
        });

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          if (!completedRef.current) {
            completedRef.current = true;
            if (preserveValue) {
              setDisplayValue(to);
            }
            onComplete?.();
          }
        }
      };

      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, delay);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    };

    const cleanup = startAnimation();
    return cleanup;
  }, [from, to, duration, delay, easing, autoStart, onStart, onComplete, preserveValue, prefersReducedMotion]);

  const formattedValue = formatNumber(displayValue, decimals, separator);
  const roundedValue = Math.round(displayValue);
  const percentage = ((displayValue - to) / (from - to)) * 100;
  
  const dynamicVariant = percentage < 20 && from > to ? 'urgent' : variant;
  
  const shouldAnnounce = Math.abs(roundedValue - lastAnnouncedRef.current) >= announceInterval;
  if (shouldAnnounce) {
    lastAnnouncedRef.current = roundedValue;
  }

  return (
    <>
      <div 
        role="timer"
        aria-live={percentage < 20 ? 'assertive' : 'polite'}
        aria-atomic="true"
        aria-label={ariaLabel}
        className="sr-only"
      >
        {(shouldAnnounce || roundedValue === to) && (
          <span>
            {roundedValue === to 
              ? 'Counter complete!' 
              : `${ariaLabel}: ${roundedValue} ${suffix}`}
          </span>
        )}
      </div>
      
      <span 
        className={cn(
          counterVariants({ size, variant: dynamicVariant }),
          isAnimating && !prefersReducedMotion && 'will-change-contents',
          className
        )}
        aria-hidden="true"
      >
        {prefix}{formattedValue}{suffix}
      </span>
    </>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';