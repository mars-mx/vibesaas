/**
 * Server Analytics Service
 *
 * Server-side analytics tracking for API routes, Server Actions, and webhooks.
 */

import { posthogServer, isServerAnalyticsEnabled, flushPostHog } from './server-client';
import {
  AUTH_EVENTS,
  PAYMENT_EVENTS,
  ANALYTICS_EVENTS,
} from './events';
import type {
  EventProperties,
  UserTraits,
  AuthEventProperties,
  PaymentEventProperties,
} from './types';

/**
 * Server-side Analytics Service
 */
export class ServerAnalyticsService {
  /**
   * Track a custom event (server-side)
   */
  static async track(
    userId: string,
    eventName: string,
    properties?: EventProperties
  ): Promise<void> {
    if (!isServerAnalyticsEnabled() || !posthogServer) {
      return;
    }

    try {
      posthogServer.capture({
        distinctId: userId,
        event: eventName,
        properties,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics Server] Event tracked:', eventName, { userId, properties });
      }
    } catch (error) {
      console.error('[Analytics Server] Failed to track event:', eventName, error);
    }
  }

  /**
   * Identify a user (server-side)
   */
  static async identify(userId: string, traits: UserTraits): Promise<void> {
    if (!isServerAnalyticsEnabled() || !posthogServer) {
      return;
    }

    try {
      posthogServer.identify({
        distinctId: userId,
        properties: traits,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics Server] User identified:', userId, traits);
      }
    } catch (error) {
      console.error('[Analytics Server] Failed to identify user:', userId, error);
    }
  }

  /**
   * Alias a user (merge anonymous user with identified user)
   */
  static async alias(userId: string, anonymousId: string): Promise<void> {
    if (!isServerAnalyticsEnabled() || !posthogServer) {
      return;
    }

    try {
      posthogServer.alias({
        distinctId: userId,
        alias: anonymousId,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics Server] User aliased:', { userId, anonymousId });
      }
    } catch (error) {
      console.error('[Analytics Server] Failed to alias user:', error);
    }
  }

  // ===========================================
  // Authentication Events (Server-Side)
  // ===========================================

  /**
   * Track user sign up (called from Clerk webhook)
   */
  static async trackSignUp(
    userId: string,
    email: string,
    properties?: AuthEventProperties
  ): Promise<void> {
    await this.track(userId, AUTH_EVENTS.USER_SIGNED_UP, {
      ...properties,
      $set: {
        email,
      },
      $set_once: {
        signupDate: new Date().toISOString(),
      },
    });
  }

  /**
   * Track user sign in (called from Clerk webhook)
   */
  static async trackSignIn(
    userId: string,
    email?: string,
    properties?: AuthEventProperties
  ): Promise<void> {
    await this.track(userId, AUTH_EVENTS.USER_SIGNED_IN, {
      ...properties,
      ...(email && {
        $set: {
          email,
        },
      }),
    });
  }

  /**
   * Track profile update
   */
  static async trackProfileUpdate(
    userId: string,
    changes: Record<string, any>
  ): Promise<void> {
    await this.track(userId, AUTH_EVENTS.USER_PROFILE_UPDATED, {
      fields_updated: Object.keys(changes),
      $set: changes,
    });
  }

  // ===========================================
  // Payment Events (Server-Side)
  // ===========================================

  /**
   * Track subscription creation (called from Polar webhook)
   */
  static async trackSubscriptionCreated(
    userId: string,
    properties: PaymentEventProperties
  ): Promise<void> {
    await this.track(userId, PAYMENT_EVENTS.SUBSCRIPTION_CREATED, {
      ...properties,
      $set: {
        plan: properties.plan,
        subscriptionStatus: 'active',
      },
    });
  }

  /**
   * Track subscription cancellation (called from Polar webhook)
   */
  static async trackSubscriptionCancelled(
    userId: string,
    properties: PaymentEventProperties
  ): Promise<void> {
    await this.track(userId, PAYMENT_EVENTS.SUBSCRIPTION_CANCELLED, {
      ...properties,
      $set: {
        subscriptionStatus: 'cancelled',
      },
    });
  }

  /**
   * Track subscription upgrade
   */
  static async trackSubscriptionUpgraded(
    userId: string,
    properties: PaymentEventProperties
  ): Promise<void> {
    await this.track(userId, PAYMENT_EVENTS.SUBSCRIPTION_UPGRADED, {
      ...properties,
      $set: {
        plan: properties.plan,
      },
    });
  }

  /**
   * Track subscription downgrade
   */
  static async trackSubscriptionDowngraded(
    userId: string,
    properties: PaymentEventProperties
  ): Promise<void> {
    await this.track(userId, PAYMENT_EVENTS.SUBSCRIPTION_DOWNGRADED, {
      ...properties,
      $set: {
        plan: properties.plan,
      },
    });
  }

  /**
   * Track subscription renewal
   */
  static async trackSubscriptionRenewed(
    userId: string,
    properties: PaymentEventProperties
  ): Promise<void> {
    await this.track(userId, PAYMENT_EVENTS.SUBSCRIPTION_RENEWED, {
      ...properties,
    });
  }

  // ===========================================
  // Webhook Handlers
  // ===========================================

  /**
   * Handle Clerk user.created webhook event
   */
  static async handleUserCreated(
    userId: string,
    email: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    // Identify user
    await this.identify(userId, {
      email,
      createdAt: new Date().toISOString(),
      ...additionalData,
    });

    // Track signup event
    await this.trackSignUp(userId, email);

    // Ensure events are sent
    await flushPostHog();
  }

  /**
   * Handle Clerk user.updated webhook event
   */
  static async handleUserUpdated(
    userId: string,
    changes: Record<string, any>
  ): Promise<void> {
    // Update user properties
    await this.identify(userId, changes);

    // Track profile update
    await this.trackProfileUpdate(userId, changes);

    // Ensure events are sent
    await flushPostHog();
  }

  /**
   * Handle Polar subscription.created webhook event
   */
  static async handleSubscriptionCreated(
    userId: string,
    subscriptionData: {
      subscriptionId: string;
      plan: string;
      amount: number;
      interval: 'month' | 'year';
      productId?: string;
    }
  ): Promise<void> {
    await this.trackSubscriptionCreated(userId, {
      subscriptionId: subscriptionData.subscriptionId,
      plan: subscriptionData.plan,
      amount: subscriptionData.amount,
      interval: subscriptionData.interval,
      productId: subscriptionData.productId,
      currency: 'USD',
    });

    // Ensure events are sent
    await flushPostHog();
  }

  /**
   * Handle Polar subscription.updated webhook event
   */
  static async handleSubscriptionUpdated(
    userId: string,
    oldPlan: string,
    newPlan: string,
    subscriptionData: {
      subscriptionId: string;
      amount: number;
      interval: 'month' | 'year';
    }
  ): Promise<void> {
    // TODO: Implement proper plan hierarchy comparison logic
    // Define your plan tiers (e.g., free < starter < pro < enterprise)
    // and compare oldPlan vs newPlan to determine if this is an upgrade or downgrade
    const isUpgrade = true; // FIXME: Replace with actual comparison logic based on your pricing tiers

    if (isUpgrade) {
      await this.trackSubscriptionUpgraded(userId, {
        subscriptionId: subscriptionData.subscriptionId,
        plan: newPlan,
        amount: subscriptionData.amount,
        interval: subscriptionData.interval,
        currency: 'USD',
      });
    } else {
      await this.trackSubscriptionDowngraded(userId, {
        subscriptionId: subscriptionData.subscriptionId,
        plan: newPlan,
        amount: subscriptionData.amount,
        interval: subscriptionData.interval,
        currency: 'USD',
      });
    }

    // Ensure events are sent
    await flushPostHog();
  }

  /**
   * Handle Polar subscription.cancelled webhook event
   */
  static async handleSubscriptionCancelled(
    userId: string,
    subscriptionData: {
      subscriptionId: string;
      plan: string;
    }
  ): Promise<void> {
    await this.trackSubscriptionCancelled(userId, {
      subscriptionId: subscriptionData.subscriptionId,
      plan: subscriptionData.plan,
    });

    // Ensure events are sent
    await flushPostHog();
  }
}
