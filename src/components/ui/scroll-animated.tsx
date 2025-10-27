'use client';

import React, { ElementType } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

// Polymorphic component utility types
type PolymorphicRef<C extends ElementType> = React.ComponentPropsWithRef<C>['ref'];

type PolymorphicComponentPropsWithRef<
  C extends ElementType,
  Props = object
> = React.PropsWithChildren<Props & { as?: C }> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props | 'as'> & {
    ref?: PolymorphicRef<C>;
  };

type ScrollAnimatedOwnProps = {
  animation?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
};

type ScrollAnimatedProps<C extends ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, ScrollAnimatedOwnProps>;

type ScrollAnimatedComponent = <C extends ElementType = 'div'>(
  props: ScrollAnimatedProps<C>
) => React.ReactElement | null;

/**
 * Wrapper component for scroll-triggered animations with automatic fallback
 */
const ScrollAnimatedComponent_: ScrollAnimatedComponent = (
  /* eslint-disable react/display-name */
  React.forwardRef(
  // @ts-expect-error - forwardRef doesn't support generic components, using type assertion
  <C extends ElementType = 'div'>(
    {
      children,
      animation = 'scroll-fade-in',
      threshold = 0.1,
      rootMargin = '0px',
      triggerOnce = true,
      as,
      className,
      disabled = false,
      ...props
    }: ScrollAnimatedProps<C>,
    forwardedRef?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    const { ref: internalRef, supportsScrollTimeline } = useScrollAnimation<HTMLElement>({
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

    const restProps = props as Record<string, unknown>;

    return (
      <Component
        ref={forwardedRef || internalRef as never}
        className={cn(
          supportsScrollTimeline ? animation : '',
          fallbackClasses,
          className
        )}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
) as unknown as ScrollAnimatedComponent) as ScrollAnimatedComponent;

(ScrollAnimatedComponent_ as unknown as { displayName: string }).displayName = 'ScrollAnimated';

export { ScrollAnimatedComponent_ as ScrollAnimated };