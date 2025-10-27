/**
 * Animation constants for marketing sections
 * These provide type-safe animation configurations
 */

export const ANIMATION_DELAYS = {
  none: '',
  fast: 'animation-delay-100',
  medium: 'animation-delay-200',
  slow: 'animation-delay-300',
  slower: 'animation-delay-400',
  slowest: 'animation-delay-500',
} as const;

export const ANIMATION_DURATIONS = {
  fast: 'animation-duration-300',
  medium: 'animation-duration-500',
  slow: 'animation-duration-700',
  slower: 'animation-duration-1000',
} as const;

export const SCROLL_ANIMATION_CLASSES = {
  fadeIn: 'scroll-fade-in',
  scaleUp: 'scroll-scale-up',
  slideUp: 'scroll-slide-up',
  parallax: 'scroll-parallax',
  stagger: 'scroll-stagger',
} as const;

export const FALLBACK_ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  scaleUp: 'animate-scale-up',
  scaleDown: 'animate-scale-down',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin',
} as const;

export type AnimationDelay = keyof typeof ANIMATION_DELAYS;
export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type ScrollAnimationClass = keyof typeof SCROLL_ANIMATION_CLASSES;
export type FallbackAnimationClass = keyof typeof FALLBACK_ANIMATION_CLASSES;