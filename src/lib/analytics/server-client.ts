/**
 * PostHog server client singleton for Next.js serverless/edge environments
 * Uses globalThis pattern to ensure single instance across all imports and hot reloads
 */

import { PostHog } from 'posthog-node';

/**
 * Global type augmentation for PostHog server client
 * Ensures type safety when accessing globalThis.__posthogServer
 */
const globalForPostHogServer = globalThis as typeof globalThis & {
  __posthogServer?: PostHog;
};

/**
 * Check if server-side analytics is enabled
 */
export const isServerAnalyticsEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_POSTHOG_ACTIVATED === 'true';
};

/**
 * Initialize PostHog server client singleton using globalThis pattern
 * This approach:
 * - Survives webpack bundling and creates single instance
 * - Works with Next.js serverless cold starts
 * - Prevents multiple client instantiations
 * - Compatible with development hot reloading
 */
if (!globalForPostHogServer.__posthogServer) {
  if (isServerAnalyticsEnabled()) {
    const apiKey = process.env.POSTHOG_API_KEY_SERVER;
    const host = process.env.POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey) {
      // Log configuration error but don't throw during module evaluation
      // This allows the app to start and degrade gracefully
      console.error(
        '[Analytics] POSTHOG_API_KEY_SERVER environment variable is not set. ' +
        'Server-side analytics will be disabled. Please add it to your .env.local file.'
      );

      // Skip initialization - globalForPostHogServer.__posthogServer remains undefined
      // Callers can detect absence via isServerAnalyticsEnabled() or null checks
    } else {
      // API key is present, initialize the client
      globalForPostHogServer.__posthogServer = new PostHog(apiKey, {
        host,
        flushAt: 20, // Flush after 20 events
        flushInterval: 10000, // Flush every 10 seconds
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] PostHog server client initialized');
      }
    }
  }
}

/**
 * Singleton PostHog server client instance
 * Use this for server-side tracking (API routes, Server Actions, webhooks)
 *
 * @example
 * import { posthogServer } from '@/lib/analytics/server-client';
 *
 * await posthogServer?.capture({
 *   distinctId: userId,
 *   event: 'user_signed_up',
 *   properties: { email: 'user@example.com' }
 * });
 */
export const posthogServer = globalForPostHogServer.__posthogServer;

/**
 * Shutdown PostHog client gracefully
 * Useful for cleanup in serverless environments
 */
export async function shutdownPostHog(): Promise<void> {
  if (globalForPostHogServer.__posthogServer) {
    await globalForPostHogServer.__posthogServer.shutdown();
  }
}

/**
 * Flush pending events immediately
 * Useful before serverless function termination
 */
export async function flushPostHog(): Promise<void> {
  if (globalForPostHogServer.__posthogServer) {
    await globalForPostHogServer.__posthogServer.flush();
  }
}
