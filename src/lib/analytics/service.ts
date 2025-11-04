/**
 * Analytics Service
 *
 * Main service for tracking events with PostHog.
 * Provides high-level methods for common tracking operations.
 */

'use client';

import { getPostHog, isAnalyticsEnabled } from './client';
import {
  ANALYTICS_EVENTS,
  AUTH_EVENTS,
  MARKETING_EVENTS,
  PAYMENT_EVENTS,
  DASHBOARD_EVENTS,
  ENGAGEMENT_EVENTS,
} from './events';
import type {
  EventProperties,
  UserTraits,
  CTAClickProperties,
  PageViewProperties,
  FeatureProperties,
  AuthEventProperties,
  PaymentEventProperties,
} from './types';
import {
  ctaClickPropertiesSchema,
  pageViewPropertiesSchema,
  userTraitsSchema,
} from './schemas';
import { AnalyticsTrackingError, AnalyticsValidationError } from './errors';

/**
 * Analytics Service - Client-side tracking
 */
export class AnalyticsService {
  /**
   * Track a custom event
   */
  static track(eventName: string, properties?: EventProperties): void {
    if (!isAnalyticsEnabled()) {
      return;
    }

    try {
      const posthog = getPostHog();
      if (!posthog) {
        return;
      }

      posthog.capture(eventName, properties);

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Event tracked:', eventName, properties);
      }
    } catch (error) {
      // Log error but never break user flows with analytics failures
      console.error('[Analytics] Failed to track event:', eventName, error);

      // Only throw in development to aid debugging
      if (process.env.NODE_ENV === 'development') {
        throw new AnalyticsTrackingError(
          `Failed to track event: ${eventName}`,
          eventName,
          error as Error
        );
      }

      // Silently fail in production - analytics should never break the app
    }
  }

  /**
   * Identify a user
   */
  static identify(userId: string, traits?: UserTraits): void {
    if (!isAnalyticsEnabled()) {
      return;
    }

    try {
      // Validate traits if provided
      if (traits) {
        userTraitsSchema.parse(traits);
      }

      const posthog = getPostHog();
      if (!posthog) {
        return;
      }

      posthog.identify(userId, traits);

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] User identified:', userId, traits);
      }
    } catch (error) {
      // Log validation or tracking errors but never break user flows
      console.error('[Analytics] Failed to identify user:', userId, error);

      // Only throw in development to aid debugging
      if (process.env.NODE_ENV === 'development' && error instanceof Error && error.name === 'ZodError') {
        throw new AnalyticsValidationError(
          'Invalid user traits',
          error,
          error
        );
      }

      // Silently fail in production
    }
  }

  /**
   * Reset the current user session
   */
  static reset(): void {
    if (!isAnalyticsEnabled()) {
      return;
    }

    try {
      const posthog = getPostHog();
      if (!posthog) {
        return;
      }

      posthog.reset();

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] User session reset');
      }
    } catch (error) {
      console.error('[Analytics] Failed to reset session:', error);
    }
  }

  /**
   * Opt user in to tracking
   */
  static optIn(): void {
    if (!isAnalyticsEnabled()) {
      return;
    }

    try {
      const posthog = getPostHog();
      if (!posthog) {
        return;
      }

      posthog.opt_in_capturing();

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] User opted in to tracking');
      }
    } catch (error) {
      console.error('[Analytics] Failed to opt in:', error);
    }
  }

  /**
   * Opt user out of tracking
   */
  static optOut(): void {
    if (!isAnalyticsEnabled()) {
      return;
    }

    try {
      const posthog = getPostHog();
      if (!posthog) {
        return;
      }

      posthog.opt_out_capturing();

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] User opted out of tracking');
      }
    } catch (error) {
      console.error('[Analytics] Failed to opt out:', error);
    }
  }

  /**
   * Check if user has opted out
   */
  static hasOptedOut(): boolean {
    if (!isAnalyticsEnabled()) {
      return true;
    }

    try {
      const posthog = getPostHog();
      if (!posthog) {
        return true;
      }

      return posthog.has_opted_out_capturing();
    } catch (error) {
      console.error('[Analytics] Failed to check opt-out status:', error);
      return true;
    }
  }

  // ===========================================
  // Marketing Events
  // ===========================================

  /**
   * Track CTA click
   */
  static trackCTAClick(location: string, text: string, additionalProps?: EventProperties): void {
    try {
      // Extract section from additionalProps if present (it's part of the CTA schema)
      const { section, ...restAdditionalProps } = additionalProps ?? {};

      // Build base CTA properties with core fields + section
      const baseProperties: CTAClickProperties = {
        cta_location: location,
        cta_text: text,
        page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        ...(typeof section === 'string' ? { section } : {}),
      };

      // Validate only the CTA-specific fields
      ctaClickPropertiesSchema.parse(baseProperties);

      // Merge validated base properties with remaining additional properties
      // This allows extra metadata ($set, campaign context, etc.) to pass through
      const properties: EventProperties = {
        ...restAdditionalProps,
        ...baseProperties,
      };

      this.track(MARKETING_EVENTS.CTA_CLICKED, properties);
    } catch (error) {
      // Log validation errors but never break user flows
      console.error('[Analytics] Failed to track CTA click:', location, text, error);

      // Only throw in development to aid debugging
      if (process.env.NODE_ENV === 'development' && error instanceof Error && error.name === 'ZodError') {
        throw new AnalyticsValidationError(
          'Invalid CTA click properties',
          error,
          error
        );
      }

      // Silently fail in production
    }
  }

  /**
   * Track pricing page view
   */
  static trackPricingView(plan?: string): void {
    this.track(MARKETING_EVENTS.PRICING_VIEWED, {
      plan,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }

  /**
   * Track feature exploration
   */
  static trackFeatureExplore(featureName: string, section?: string): void {
    this.track(MARKETING_EVENTS.FEATURE_EXPLORED, {
      feature_name: featureName,
      section,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }

  /**
   * Track hero CTA click
   */
  static trackHeroCTAClick(ctaText: string): void {
    this.trackCTAClick('hero_section', ctaText, {
      section: 'hero',
    });
  }

  /**
   * Track GitHub link click
   */
  static trackGitHubLinkClick(location: string): void {
    this.track(MARKETING_EVENTS.GITHUB_LINK_CLICKED, {
      location,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }

  /**
   * Track waitlist signup
   */
  static trackWaitlistJoin(email: string): void {
    this.track(MARKETING_EVENTS.WAITLIST_JOINED, {
      $set: {
        email,
        waitlist: true,
      },
    });
  }

  /**
   * Track navigation click
   */
  static trackNavigationClick(item: string, destination: string): void {
    this.track(MARKETING_EVENTS.NAVIGATION_CLICKED, {
      navigation_item: item,
      destination,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }

  // ===========================================
  // Authentication Events
  // ===========================================

  /**
   * Track user sign up
   * Note: Should be called from server-side via webhook
   */
  static trackSignUp(email: string, method?: string): void {
    this.track(AUTH_EVENTS.USER_SIGNED_UP, {
      method,
      $set: {
        email,
      },
      $set_once: {
        signupDate: new Date().toISOString(),
      },
    });
  }

  /**
   * Track user sign in
   */
  static trackSignIn(method?: string): void {
    this.track(AUTH_EVENTS.USER_SIGNED_IN, {
      method,
    });
  }

  /**
   * Track user sign out
   */
  static trackSignOut(): void {
    this.track(AUTH_EVENTS.USER_SIGNED_OUT, {});
    // Reset session after tracking sign out
    setTimeout(() => this.reset(), 100);
  }

  /**
   * Track profile update
   */
  static trackProfileUpdate(changes: string[]): void {
    this.track(AUTH_EVENTS.USER_PROFILE_UPDATED, {
      fields_updated: changes,
    });
  }

  // ===========================================
  // Payment Events
  // ===========================================

  /**
   * Track checkout initiation
   */
  static trackCheckoutInitiated(plan: string, amount?: number, interval?: 'month' | 'year'): void {
    this.track(PAYMENT_EVENTS.CHECKOUT_INITIATED, {
      plan,
      amount,
      interval,
      currency: 'USD',
    });
  }

  /**
   * Track subscription creation
   */
  static trackSubscriptionCreated(
    subscriptionId: string,
    plan: string,
    amount: number,
    interval: 'month' | 'year'
  ): void {
    this.track(PAYMENT_EVENTS.SUBSCRIPTION_CREATED, {
      subscriptionId,
      plan,
      amount,
      interval,
      currency: 'USD',
      $set: {
        plan,
        subscriptionStatus: 'active',
      },
    });
  }

  /**
   * Track subscription cancellation
   */
  static trackSubscriptionCancelled(subscriptionId: string, plan: string): void {
    this.track(PAYMENT_EVENTS.SUBSCRIPTION_CANCELLED, {
      subscriptionId,
      plan,
      $set: {
        subscriptionStatus: 'cancelled',
      },
    });
  }

  // ===========================================
  // Dashboard Events
  // ===========================================

  /**
   * Track dashboard view
   */
  static trackDashboardView(): void {
    this.track(DASHBOARD_EVENTS.DASHBOARD_VIEWED, {
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }

  /**
   * Track settings view
   */
  static trackSettingsView(): void {
    this.track(DASHBOARD_EVENTS.SETTINGS_VIEWED, {
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  }

  /**
   * Track feature usage
   */
  static trackFeatureUsed(featureName: string, properties?: FeatureProperties): void {
    this.track(DASHBOARD_EVENTS.FEATURE_USED, {
      feature_name: featureName,
      ...properties,
    });
  }

  // ===========================================
  // Page Views
  // ===========================================

  /**
   * Track page view
   */
  static trackPageView(path?: string, title?: string): void {
    try {
      const properties: PageViewProperties = {
        page_path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
        page_title: title || (typeof document !== 'undefined' ? document.title : undefined),
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      };

      // Validate properties
      pageViewPropertiesSchema.parse(properties);

      this.track(ENGAGEMENT_EVENTS.PAGE_VIEWED, properties);
    } catch (error) {
      // Log validation errors but never break user flows
      console.error('[Analytics] Failed to track page view:', path, error);

      // Only throw in development to aid debugging
      if (process.env.NODE_ENV === 'development' && error instanceof Error && error.name === 'ZodError') {
        throw new AnalyticsValidationError(
          'Invalid page view properties',
          error,
          error
        );
      }

      // Silently fail in production
    }
  }
}
