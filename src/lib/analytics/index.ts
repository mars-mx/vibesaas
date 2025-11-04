/**
 * Analytics Module - Client-Side Service Layer
 *
 * Main exports for PostHog analytics integration (client-side service and utilities).
 *
 * IMPORTANT: This barrel does NOT export React hooks to maintain server/client boundaries.
 * - For React hooks: import from '@/lib/analytics/hooks/use-analytics' or '@/lib/analytics/hooks/use-page-view'
 * - For server-side analytics: import from '@/lib/analytics/server'
 */

// Client-side service and utilities
export { AnalyticsService } from './service';
export { getPostHog, initPostHog, isAnalyticsEnabled } from './client';

// Events
export * from './events';

// Types
export type {
  EventProperties,
  UserTraits,
  CTAClickProperties,
  PageViewProperties,
  FeatureProperties,
  AuthEventProperties,
  PaymentEventProperties,
  AnalyticsConfig,
  BaseEventProperties,
} from './types';

// Errors
export {
  AnalyticsError,
  AnalyticsNotInitializedError,
  AnalyticsDisabledError,
  AnalyticsTrackingError,
  AnalyticsConfigError,
  AnalyticsValidationError,
} from './errors';
