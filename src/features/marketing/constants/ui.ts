/**
 * UI Constants for Marketing Components
 * Centralized configuration for animations, breakpoints, and styling
 */

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export const SPACING = {
  heroMinHeight: "90vh",
  sectionPaddingY: {
    mobile: "py-24",
    desktop: "sm:py-32",
  },
  containerMaxWidth: "max-w-7xl",
} as const;

export const BLUR_AMOUNTS = {
  orb: "blur-3xl",
  backdrop: "backdrop-blur-xl",
  hover: "blur",
} as const;

export const SHADOW_PRESETS = {
  button: "shadow-lg shadow-primary/25",
  card: "shadow-xl",
  subtle: "shadow-sm",
} as const;

export const TRANSITION_CLASSES = {
  default: "transition-all",
  colors: "transition-colors",
  transform: "transition-transform",
  shadow: "transition-shadow",
} as const;

export const GRADIENT_PRESETS = {
  primary: "bg-gradient-to-r from-primary to-secondary",
  surface: "bg-gradient-to-b from-background via-primary/5 to-background",
  text: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
} as const;