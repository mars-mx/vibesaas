# Accessibility Guidelines

## WCAG 2.2 Level AA Compliance

### Color Contrast Requirements

- **Normal text**: 4.5:1 contrast ratio with background
- **Large text**: 3:1 contrast ratio (18pt+ or 14pt+ bold)
- **UI components**: 3:1 contrast ratio for interactive elements
- **Decorative text**: No requirement (logos, disabled state)

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```tsx
// Good: Keyboard accessible button
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
>
  Click me
</button>
```

**Requirements:**
- Logical tab order following visual flow
- Visible focus indicators (2px ring minimum)
- Escape key closes modals/overlays
- Skip links for main content

### Semantic HTML Structure

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <header>
      <h1>Page Title</h1>
    </header>
    <section aria-labelledby="section-title">
      <h2 id="section-title">Section Title</h2>
      <!-- Content -->
    </section>
  </article>
</main>
```

### Form Accessibility

```tsx
<form noValidate>
  <div className="space-y-4">
    <div>
      <label htmlFor="email" className="block text-sm font-medium">
        Email Address
        <span className="text-destructive ml-1" aria-label="required">*</span>
      </label>
      <input
        type="email"
        id="email"
        required
        aria-describedby="email-error email-hint"
        aria-invalid={!!errors.email}
        className="mt-1 block w-full min-h-[44px]"
      />
      <p id="email-hint" className="mt-1 text-sm text-muted-foreground">
        We'll never share your email
      </p>
      {errors.email && (
        <p id="email-error" role="alert" className="mt-1 text-sm text-destructive">
          {errors.email.message}
        </p>
      )}
    </div>
  </div>
</form>
```

### Touch Targets

- Minimum size: 24x24 CSS pixels (WCAG 2.2)
- Recommended: 44x44px for mobile devices
- Adequate spacing between targets

### Screen Reader Support

```tsx
// Announce dynamic content changes
<div role="status" aria-live="polite" aria-atomic="true">
  {isLoading && <span className="sr-only">Loading...</span>}
</div>

// Descriptive button labels
<button aria-label="Delete item: Product Name">
  <TrashIcon aria-hidden="true" />
</button>

// Table headers
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
</table>
```

### Skip Navigation

```tsx
// Add at the beginning of your layout
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background px-4 py-2 rounded-md"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Content */}
</main>
```

### Testing Checklist

- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Check color contrast with tools
- [ ] Verify focus indicators are visible
- [ ] Test with 200% browser zoom
- [ ] Validate HTML semantics
- [ ] Test form error announcements
- [ ] Verify all images have alt text
- [ ] Check that videos have captions
- [ ] Test in high contrast mode

### Tools

- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools
- **NVDA**: Free screen reader for Windows
- **VoiceOver**: Built-in screen reader for Mac/iOS