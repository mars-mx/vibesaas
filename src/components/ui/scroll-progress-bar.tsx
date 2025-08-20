'use client';

import { cn } from "@/lib/utils/cn";

interface ScrollProgressBarProps {
  className?: string;
  height?: string | number;
  gradient?: boolean;
  colors?: {
    from?: string;
    to?: string;
  };
}

export function ScrollProgressBar({
  className,
  height = 4,
  gradient = true,
  colors = {
    from: "var(--primary)",
    to: "var(--accent)"
  }
}: ScrollProgressBarProps) {
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  
  const backgroundStyle = gradient
    ? { background: `linear-gradient(90deg, ${colors.from} 0%, ${colors.to} 100%)` }
    : { background: colors.from };

  return (
    <div
      className={cn(
        "scroll-progress-bar",
        className
      )}
      style={{
        ...backgroundStyle,
        height: heightValue,
      }}
      aria-hidden="true"
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}