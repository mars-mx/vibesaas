'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  animationClass?: string;
  fallbackClass?: string;
  disabled?: boolean;
}

/**
 * Hook for scroll-triggered animations with Intersection Observer fallback
 * Provides cross-browser support for scroll animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    animationClass = '',
    fallbackClass = 'animate-in',
    disabled = false
  } = options;

  const elementRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [supportsScrollTimeline, setSupportsScrollTimeline] = useState(false);

  // Check for native scroll-timeline support
  useEffect(() => {
    if (typeof window !== 'undefined' && CSS && CSS.supports) {
      setSupportsScrollTimeline(
        CSS.supports('animation-timeline', 'scroll()')
      );
    }
  }, []);

  // Apply animation classes
  useEffect(() => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;

    if (supportsScrollTimeline && animationClass) {
      // Use native scroll-driven animations
      element.classList.add(animationClass);
    } else if (isInView && !hasAnimated) {
      // Use fallback animation
      element.classList.add(fallbackClass);
      if (triggerOnce) {
        setHasAnimated(true);
      }
    } else if (!isInView && !triggerOnce) {
      element.classList.remove(fallbackClass);
    }
  }, [isInView, hasAnimated, supportsScrollTimeline, animationClass, fallbackClass, triggerOnce, disabled]);

  // Intersection Observer for fallback
  useEffect(() => {
    if (!elementRef.current || disabled || supportsScrollTimeline) return;

    const element = elementRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, disabled, supportsScrollTimeline]);

  const reset = useCallback(() => {
    setHasAnimated(false);
    setIsInView(false);
    if (elementRef.current) {
      elementRef.current.classList.remove(fallbackClass);
    }
  }, [fallbackClass]);

  return {
    ref: elementRef,
    isInView,
    hasAnimated,
    supportsScrollTimeline,
    reset
  };
}

/**
 * Hook for parallax scroll effects with performance optimization
 */
export function useParallaxScroll<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.5,
  offset: number = 0
) {
  const elementRef = useRef<T>(null);
  const [transform, setTransform] = useState('');
  const rafRef = useRef<number>();
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!elementRef.current) return;

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const deltaY = scrollY - lastScrollY.current;
        
        // Only update if scroll changed significantly (>1px)
        if (Math.abs(deltaY) > 1) {
          const translateY = (scrollY * speed) + offset;
          setTransform(`translate3d(0, ${translateY}px, 0)`);
          lastScrollY.current = scrollY;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, offset]);

  return {
    ref: elementRef,
    style: { transform, willChange: 'transform' }
  };
}

/**
 * Hook for staggered animations on multiple elements
 */
export function useStaggeredAnimation(
  itemCount: number,
  baseDelay: number = 100,
  options: UseScrollAnimationOptions = {}
) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setInViewStates((prev) => {
                  const next = [...prev];
                  next[index] = true;
                  return next;
                });
              }, index * baseDelay);

              if (options.triggerOnce) {
                observer.disconnect();
              }
            } else if (!options.triggerOnce) {
              setInViewStates((prev) => {
                const next = [...prev];
                next[index] = false;
                return next;
              });
            }
          });
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '0px',
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [itemCount, baseDelay, options]);

  const setRef = useCallback((index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  }, []);

  return {
    setRef,
    inViewStates
  };
}