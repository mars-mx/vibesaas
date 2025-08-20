/**
 * Animation constants for marketing sections
 * These provide type-safe animation configurations
 */

export const ANIMATION_ORB_SIZES = {
  small: 'w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]',
  medium: 'w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]',
  large: 'w-[400px] h-[400px] sm:w-[600px] sm:h-[600px]',
} as const;

export const ANIMATION_ORB_POSITIONS = {
  topLeft: '-top-20 -left-20 sm:-top-40 sm:-left-40',
  topRight: '-top-20 -right-20 sm:-top-40 sm:-right-40',
  bottomLeft: '-bottom-20 -left-20 sm:-bottom-40 sm:-left-40',
  bottomRight: '-bottom-20 -right-20 sm:-bottom-40 sm:-right-40',
  bottomCenter: '-bottom-20 left-1/2 -translate-x-1/2',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
} as const;

export const ANIMATION_ORB_COLORS = {
  primary: 'bg-primary/20',
  secondary: 'bg-secondary/20',
  accent: 'bg-accent/20',
  muted: 'bg-muted/30',
} as const;

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

export type AnimationOrbSize = keyof typeof ANIMATION_ORB_SIZES;
export type AnimationOrbPosition = keyof typeof ANIMATION_ORB_POSITIONS;
export type AnimationOrbColor = keyof typeof ANIMATION_ORB_COLORS;
export type AnimationDelay = keyof typeof ANIMATION_DELAYS;
export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type ScrollAnimationClass = keyof typeof SCROLL_ANIMATION_CLASSES;
export type FallbackAnimationClass = keyof typeof FALLBACK_ANIMATION_CLASSES;