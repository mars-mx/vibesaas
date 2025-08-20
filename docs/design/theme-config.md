# Theme Configuration Guide

## Extending globals.css

Add these theme configurations to your existing `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  /* Existing color system */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  
  /* Add spacing system */
  --spacing-unit: 0.25rem;
  --spacing-xs: calc(var(--spacing-unit) * 2);
  --spacing-sm: calc(var(--spacing-unit) * 3);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 6);
  --spacing-xl: calc(var(--spacing-unit) * 8);
  --spacing-2xl: calc(var(--spacing-unit) * 12);
  --spacing-3xl: calc(var(--spacing-unit) * 16);
  
  /* Add border radius system */
  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) - 0.25rem);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 0.25rem);
  --radius-xl: calc(var(--radius) + 0.5rem);
  --radius-full: 9999px;
  
  /* Add fluid typography scale */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem);
  --text-4xl: clamp(2.25rem, 1.8rem + 2.25vw, 3rem);
  --text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);
  
  /* Add shadow system */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Add transition durations */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}

/* Dark mode with Tailwind v4 custom variant */
@custom-variant dark (&:is(.dark *));

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

/* Accessibility: Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus visible styles */
*:focus-visible {
  outline: 2px solid var(--color-primary, var(--foreground));
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--background);
  color: var(--foreground);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius);
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: var(--spacing-md);
  left: var(--spacing-md);
}

/* Utility classes for fluid typography */
.text-fluid-xs { font-size: var(--text-xs); }
.text-fluid-sm { font-size: var(--text-sm); }
.text-fluid-base { font-size: var(--text-base); }
.text-fluid-lg { font-size: var(--text-lg); }
.text-fluid-xl { font-size: var(--text-xl); }
.text-fluid-2xl { font-size: var(--text-2xl); }
.text-fluid-3xl { font-size: var(--text-3xl); }
.text-fluid-4xl { font-size: var(--text-4xl); }
.text-fluid-5xl { font-size: var(--text-5xl); }

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## Usage Examples

### Using Custom Properties

```tsx
// In your components
<div className="p-[var(--spacing-md)] rounded-[var(--radius)]">
  <h1 className="text-fluid-4xl">Responsive Heading</h1>
  <p className="text-fluid-base mt-[var(--spacing-sm)]">
    Body text that scales smoothly
  </p>
</div>

// Or create Tailwind utilities
<div className="spacing-md radius-lg">
  {/* Content */}
</div>
```

### shadcn/ui Color System

For full shadcn/ui integration, extend with these colors:

```css
@theme {
  /* shadcn/ui colors (HSL format) */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 10% 3.9%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```