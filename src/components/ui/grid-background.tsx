import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
  gridOpacity?: number;
}

export function GridBackground({
  children,
  className,
  gridSize = 50,
  gridOpacity = 0.15,
}: GridBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Grid Background with reverse vignette - stronger at edges, invisible in center */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: `radial-gradient(ellipse 100% 100% at center, transparent 0%, black 60%)`,
          WebkitMaskImage: `radial-gradient(ellipse 100% 100% at center, transparent 0%, black 60%)`,
        }}
      />

      {children}
    </div>
  );
}
