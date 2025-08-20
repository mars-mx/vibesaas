# Responsive Design Guide

## Mobile-First Approach

Start designing at 375px width and enhance for larger screens.

## Tailwind CSS v4 Breakpoints

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| (default) | 0px | Mobile first base |
| `sm:` | 640px | `@media (min-width: 640px)` |
| `md:` | 768px | `@media (min-width: 768px)` |
| `lg:` | 1024px | `@media (min-width: 1024px)` |
| `xl:` | 1280px | `@media (min-width: 1280px)` |
| `2xl:` | 1536px | `@media (min-width: 1536px)` |

## Fluid Typography

### CSS Custom Properties

```css
/* Add to globals.css @theme */
@theme {
  /* Fluid type scale using clamp() */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem);
  --text-4xl: clamp(2.25rem, 1.8rem + 2.25vw, 3rem);
  --text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);
}
```

### Usage in Components

```tsx
// Use fluid typography
<h1 className="text-[var(--text-4xl)] font-bold">
  Responsive Heading
</h1>

// Or with Tailwind classes
<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
  Responsive Heading
</h1>
```

## Responsive Grid Patterns

### Auto-Fit Grid

```tsx
// Responsive card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</div>

// CSS Grid with auto-fit
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {/* Cards auto-adjust based on available space */}
</div>
```

### Container Queries

```css
/* Container queries for component-level responsiveness */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

## Responsive Navigation

```tsx
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background border-b">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-4"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <MenuIcon />
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-6 p-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="flex flex-col p-4 space-y-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
        </div>
      )}
    </nav>
  )
}
```

## Touch-Friendly Design

### Minimum Touch Targets

```tsx
// Ensure touch targets are at least 44x44px
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Tap Me
</button>

// Increase tap area without visual size
<button className="relative p-2">
  <span className="absolute inset-0 -m-2" aria-hidden="true" />
  Icon Button
</button>
```

### Mobile Form Inputs

```tsx
// Prevent zoom on iOS
<input
  type="email"
  className="text-base min-h-[44px] px-3 py-2"
  inputMode="email"
  autoComplete="email"
/>

// Mobile-optimized select
<select className="text-base min-h-[44px] px-3 py-2">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## Responsive Images

```tsx
// Next.js responsive image
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  className="object-cover"
/>

// Art direction with different images
<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/hero-mobile.jpg"
  />
  <source
    media="(max-width: 1024px)"
    srcSet="/hero-tablet.jpg"
  />
  <img
    src="/hero-desktop.jpg"
    alt="Hero"
    className="w-full h-auto"
  />
</picture>
```

## Responsive Tables

```tsx
// Mobile-friendly table
<div className="overflow-x-auto">
  <table className="min-w-full">
    <thead className="hidden sm:table-header-group">
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id} className="block sm:table-row border-b">
          <td className="block sm:table-cell py-2 sm:py-4">
            <span className="sm:hidden font-semibold">Name: </span>
            {user.name}
          </td>
          <td className="block sm:table-cell py-2 sm:py-4">
            <span className="sm:hidden font-semibold">Email: </span>
            {user.email}
          </td>
          <td className="block sm:table-cell py-2 sm:py-4">
            <span className="sm:hidden font-semibold">Role: </span>
            {user.role}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Responsive Spacing

```tsx
// Responsive padding/margin
<div className="p-4 sm:p-6 lg:p-8 xl:p-12">
  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
    {/* Content with responsive spacing */}
  </div>
</div>

// Responsive gap in flex/grid
<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
  {/* Items */}
</div>
```

## Testing Responsive Design

### Device Testing Checklist

- [ ] Test on real devices (not just DevTools)
- [ ] Check iOS Safari specific issues
- [ ] Test Android Chrome
- [ ] Verify touch interactions work
- [ ] Test landscape orientation
- [ ] Check text readability at all sizes
- [ ] Verify images load appropriately
- [ ] Test with slow 3G connection
- [ ] Check offline functionality
- [ ] Test with browser zoom (up to 200%)

### Common Breakpoints to Test

- 375px (iPhone SE)
- 390px (iPhone 12/13/14)
- 414px (iPhone Plus)
- 768px (iPad)
- 1024px (iPad Pro / Small laptop)
- 1366px (Common laptop)
- 1920px (Desktop)
- 2560px (Large display)