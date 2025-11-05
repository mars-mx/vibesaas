/**
 * Analytics Module - Server-Side Only
 *
 * Server-side exports for PostHog analytics integration.
 * Only import this in Server Components, API Routes, or Server Actions.
 *
 * @example
 * // In API route or Server Action
 * import { ServerAnalyticsService } from '@/lib/analytics/server';
 *
 * await ServerAnalyticsService.trackSignUp(userId, email);
 */

// Server-side exports
export { ServerAnalyticsService } from './server-service';
export { posthogServer, isServerAnalyticsEnabled, flushPostHog, shutdownPostHog } from './server-client';

// Re-export types (safe for server)
export type {
  EventProperties,
  UserTraits,
  AuthEventProperties,
  PaymentEventProperties,
} from './types';

// Re-export events (safe for server)
export * from './events';

// Re-export errors (safe for server)
export {
  AnalyticsError,
  AnalyticsTrackingError,
  AnalyticsConfigError,
} from './errors';
