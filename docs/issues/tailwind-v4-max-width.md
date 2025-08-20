# Tailwind CSS v4 Max-Width Utilities in Nested Containers

## Issue Description

When using Tailwind CSS v4 with nested container components, `max-w-*` utility classes may not behave as expected. The max-width constraint might not be applied correctly when the element is inside multiple nested containers with their own width constraints.

### Example Problem

```tsx
// This doesn't work as expected
<Container> {/* Has max-w-7xl */}
  <div className="mx-auto mt-16 px-4 sm:px-6 lg:px-8">
    <div className="relative mx-auto max-w-sm"> {/* max-w-sm not applying */}
      <Card>...</Card>
    </div>
  </div>
</Container>
```

## Root Cause

The issue occurs due to:
1. **Nested Container Constraints**: The parent Container component already has `max-w-7xl` set
2. **Additional Padding Layers**: Extra padding divs between the container and the target element
3. **Width Inheritance**: Child elements inheriting width constraints from multiple parents

## Solution

Use explicit responsive width utilities instead of max-width utilities when dealing with nested containers:

### ✅ Working Solution

```tsx
<Container>
  <div className="mx-auto mt-16"> {/* Remove extra padding here */}
    <div className="relative mx-auto w-full sm:w-80 lg:w-96"> {/* Use explicit widths */}
      <Card>...</Card>
    </div>
  </div>
</Container>
```

### Width Values Reference

- `w-80` = 320px (20rem)
- `w-96` = 384px (24rem)
- `w-full` = 100% width

## Best Practices

### When to Use Explicit Widths

Use explicit width utilities (`w-*`) when:
- The element is inside nested containers
- You need precise control over element sizing
- Creating fixed-width components (like pricing cards)
- Building grid layouts with specific column widths

### When to Use Max-Width

Use max-width utilities (`max-w-*`) when:
- The element is a top-level container
- You want fluid width with an upper limit
- Creating responsive text containers
- The element isn't nested in other width-constrained containers

## Additional Considerations

### Responsive Design

Always use responsive prefixes for better mobile experience:
```tsx
// Mobile-first approach
className="w-full sm:w-80 lg:w-96"
```

### Container Component

If using a custom Container component, be aware of its default constraints:
```tsx
// Typical Container component
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
```

## Related Issues

- Tailwind CSS v4 uses a new architecture that might handle cascading constraints differently
- Always check parent elements for width/max-width constraints
- Use browser DevTools to inspect computed styles when debugging width issues

## References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Width Utilities](https://tailwindcss.com/docs/width)
- [Max-Width Utilities](https://tailwindcss.com/docs/max-width)