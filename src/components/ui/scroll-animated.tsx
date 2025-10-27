'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface ScrollAnimatedProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animation?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
}

/**
 * Wrapper component for scroll-triggered animations with automatic fallback
 */
export function ScrollAnimated({
  children,
  animation = 'scroll-fade-in',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  as: Component = 'div',
  className,
  disabled = false,
  ...props
}: ScrollAnimatedProps) {
  const { ref, supportsScrollTimeline } = useScrollAnimation<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce,
    animationClass: animation,
    fallbackClass: 'animate-fade-in',
    disabled
  });

  // Add fallback CSS classes for browsers without scroll-timeline support
  const fallbackClasses = !supportsScrollTimeline && !disabled
    ? 'opacity-0 transition-all duration-700 ease-out [&.animate-fade-in]:opacity-100 [&.animate-fade-in]:translate-y-0'
    : '';

  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        supportsScrollTimeline ? animation : '',
        fallbackClasses,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}