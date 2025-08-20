# Performance Optimization Guide

## Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint - Loading performance |
| **INP** | < 200ms | Interaction to Next Paint - Responsiveness |
| **CLS** | < 0.1 | Cumulative Layout Shift - Visual stability |
| **FCP** | < 1.8s | First Contentful Paint - Initial render |
| **TTFB** | < 800ms | Time to First Byte - Server response |

## Image Optimization

### Next.js Image Component

```tsx
import Image from 'next/image'

// Good: Optimized image loading
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-fold images
  placeholder="blur"
  blurDataURL={dataUrl}
/>

// For responsive images
<Image
  src="/product.jpg"
  alt="Product"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

### Modern Image Formats

```html
<picture>
  <source srcset="/image.avif" type="image/avif" />
  <source srcset="/image.webp" type="image/webp" />
  <img 
    src="/image.jpg" 
    alt="Fallback"
    width="800" 
    height="600"
    loading="lazy"
    decoding="async"
  />
</picture>
```

## JavaScript Optimization

### Code Splitting

```tsx
// Dynamic imports for route-based splitting
const DashboardPage = lazy(() => import('./pages/Dashboard'))

// Component-level splitting
const HeavyChart = dynamic(() => import('./components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### Bundle Size Management

```javascript
// Use tree-shakeable imports
import { debounce } from 'lodash-es' // Good
import _ from 'lodash' // Bad - imports entire library

// Analyze bundle size
// Add to package.json scripts:
"analyze": "ANALYZE=true next build"
```

## Critical CSS

```tsx
// app/layout.tsx - Inline critical CSS
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-fold styles */
            body { margin: 0; font-family: system-ui; }
            .hero { /* ... */ }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT
  variable: '--font-inter',
  preload: true
})

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## Lazy Loading Strategies

### Intersection Observer

```tsx
function LazySection({ children }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {isVisible ? children : <Skeleton />}
    </div>
  )
}
```

## Resource Hints

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/critical.css" as="style" />

<!-- Prefetch next page resources -->
<link rel="prefetch" href="/next-page.js" />
```

## Performance Monitoring

```tsx
// utils/webVitals.ts
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
    case 'LCP':
    case 'CLS':
    case 'FID':
    case 'TTFB':
    case 'INP':
      // Send to analytics
      console.log(metric)
      break
  }
}

// app/layout.tsx
import { reportWebVitals } from '@/utils/webVitals'
export { reportWebVitals }
```

## Caching Strategies

```tsx
// API Route caching
export const revalidate = 3600 // Revalidate every hour

// Static generation
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Client-side caching with SWR/React Query
const { data } = useSWR('/api/data', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0
})
```

## Performance Checklist

- [ ] Images optimized with Next.js Image
- [ ] JavaScript bundles < 200KB gzipped
- [ ] Critical CSS inlined
- [ ] Fonts optimized with font-display: swap
- [ ] Code splitting implemented
- [ ] Lazy loading for below-fold content
- [ ] Resource hints added (preconnect, prefetch)
- [ ] Static generation where possible
- [ ] API responses cached appropriately
- [ ] Third-party scripts loaded efficiently
- [ ] Reduced motion preferences respected
- [ ] Service worker for offline support (optional)