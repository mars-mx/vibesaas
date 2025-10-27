'use client';

import { motion, MotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Common animation variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Animation wrapper components
interface AnimatedSectionProps extends MotionProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
}

export function AnimatedSection({ 
  children, 
  variants = fadeInUpVariants,
  className,
  ...props 
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedDiv({ 
  children, 
  variants = fadeInUpVariants,
  className,
  ...props 
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Parallax scroll component
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  return (
    <motion.div
      className={className}
      style={{
        y: `calc(var(--scroll-progress) * ${speed * 100}px)`
      }}
    >
      {children}
    </motion.div>
  );
}

// Hero title animation
export function HeroTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.19, 1, 0.22, 1],
        delay: 0.1 
      }}
    >
      {children}
    </motion.h1>
  );
}

// Animated counter
interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function MotionCounter({
  to,
  duration = 2,
  className,
  suffix = '',
  prefix = ''
}: Omit<AnimatedCounterProps, 'from'>) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration }}
        >
          {to}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
}

// Hover effects
export const hoverScaleVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 }
};

export const hoverGlowVariants: Variants = {
  rest: { boxShadow: '0 0 0 rgba(242, 64, 27, 0)' },
  hover: { boxShadow: '0 0 20px rgba(242, 64, 27, 0.3)' }
};

// Reduced motion wrapper
export function ReducedMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={true}
      style={{ 
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none !important',
          transition: 'none !important'
        }
      } as React.CSSProperties}
    >
      {children}
    </motion.div>
  );
}