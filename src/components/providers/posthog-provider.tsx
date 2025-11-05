/**
 * PostHog Provider
 *
 * Initializes PostHog analytics on the client-side.
 */

'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { initPostHog, isAnalyticsEnabled } from '@/lib/analytics/client';
import { AnalyticsService } from '@/lib/analytics/service';
import { usePageView } from '@/lib/analytics/hooks/use-page-view';

interface PostHogProviderProps {
  children: React.ReactNode;
}

/**
 * PostHog Provider Component
 *
 * This component:
 * 1. Initializes PostHog on mount
 * 2. Identifies users when authenticated
 * 3. Resets session on sign out
 * 4. Automatically tracks page views
 *
 * @example
 * <PostHogProvider>
 *   <YourApp />
 * </PostHogProvider>
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  const { userId, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  // Auto-track page views
  usePageView();

  // Initialize PostHog
  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      return;
    }

    initPostHog();
  }, []);

  // Identify user when authenticated
  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      return;
    }

    if (!authLoaded || !userLoaded) {
      return;
    }

    if (userId && user) {
      // Identify user with Clerk data
      AnalyticsService.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || undefined,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        createdAt: user.createdAt?.toISOString(),
      });
    } else {
      // Reset session if user signs out
      AnalyticsService.reset();
    }
  }, [userId, user, authLoaded, userLoaded]);

  return <>{children}</>;
}
