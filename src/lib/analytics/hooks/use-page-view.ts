/**
 * usePageView Hook
 *
 * Automatically tracks page views on route changes.
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnalyticsService } from '../service';

/**
 * Hook to automatically track page views
 * Should be used in the root layout or a top-level component
 *
 * @example
 * function RootLayout({ children }) {
 *   usePageView();
 *   return <html><body>{children}</body></html>;
 * }
 */
export function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      AnalyticsService.trackPageView(url);
    }
  }, [pathname, searchParams]);
}
