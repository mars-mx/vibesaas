/**
 * Analytics Module - Client-Side Only
 *
 * Main exports for PostHog analytics integration (client-side).
 * For server-side analytics, import from '@/lib/analytics/server'
 */

// Client-side exports
export { AnalyticsService } from './service';
export { getPostHog, initPostHog, isAnalyticsEnabled } from './client';

// Hooks
export { useAnalytics } from './hooks/use-analytics';
export { usePageView } from './hooks/use-page-view';

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
