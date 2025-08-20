export const ANIMATION_ORB_SIZES = {
  small: "h-[400px] w-[400px]",
  medium: "h-[500px] w-[500px]",
  large: "h-[600px] w-[600px]",
} as const;

export const ANIMATION_ORB_POSITIONS = {
  topLeft: "-left-1/4 top-0",
  topRight: "-right-1/4 top-1/2",
  bottomCenter: "bottom-0 left-1/2 -translate-x-1/2",
} as const;

export const ANIMATION_ORB_COLORS = {
  primary: "bg-primary/20",
  secondary: "bg-secondary/20",
  accent: "bg-accent/20",
} as const;