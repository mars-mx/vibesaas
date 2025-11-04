/**
 * Analytics Types
 *
 * TypeScript type definitions for PostHog analytics integration.
 */

import type { Properties } from 'posthog-js';

/**
 * Base event properties that can be included with any event
 */
export interface BaseEventProperties extends Properties {
  /**
   * User properties to set/update
   */
  $set?: {
    email?: string;
    name?: string;
    plan?: string;
    subscriptionStatus?: string;
    [key: string]: string | number | boolean | undefined;
  };

  /**
   * User properties to set once (won't overwrite existing values)
   */
  $set_once?: {
    signupDate?: string;
    firstReferrer?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

/**
 * Event properties for tracking events
 */
export interface EventProperties extends BaseEventProperties {
  [key: string]: any;
}

/**
 * User traits for identification
 */
export interface UserTraits {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  plan?: 'free' | 'pro' | 'business' | 'enterprise';
  subscriptionStatus?: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  createdAt?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  apiKey: string;
  host: string;
  enabled: boolean;
  enableSessionReplay: boolean;
  disableCookie: boolean;
  debug: boolean;
}

/**
 * CTA click properties
 */
export interface CTAClickProperties {
  cta_location: string;
  cta_text: string;
  page_path?: string;
  section?: string;
}

/**
 * Page view properties
 */
export interface PageViewProperties {
  page_title?: string;
  page_path: string;
  referrer?: string;
}

/**
 * Feature interaction properties
 */
export interface FeatureProperties {
  feature_name: string;
  feature_category?: string;
  interaction_type?: 'view' | 'click' | 'submit' | 'toggle';
}

/**
 * Authentication event properties
 */
export interface AuthEventProperties {
  method?: 'email' | 'google' | 'github' | 'oauth';
  provider?: string;
}

/**
 * Payment event properties
 */
export interface PaymentEventProperties {
  plan?: string;
  amount?: number;
  currency?: string;
  interval?: 'month' | 'year';
  subscriptionId?: string;
  productId?: string;
}
