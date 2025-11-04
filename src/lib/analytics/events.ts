/**
 * Analytics Events Catalog
 *
 * Centralized event names and helpers for PostHog tracking.
 * Using snake_case naming convention as per PostHog best practices.
 */

/**
 * Authentication Events
 */
export const AUTH_EVENTS = {
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  USER_PROFILE_UPDATED: 'user_profile_updated',
} as const;

/**
 * Marketing Events
 */
export const MARKETING_EVENTS = {
  CTA_CLICKED: 'cta_clicked',
  PRICING_VIEWED: 'pricing_viewed',
  FEATURE_EXPLORED: 'feature_explored',
  HERO_CTA_CLICKED: 'hero_cta_clicked',
  GITHUB_LINK_CLICKED: 'github_link_clicked',
  WAITLIST_JOINED: 'waitlist_joined',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',
  NAVIGATION_CLICKED: 'navigation_clicked',
} as const;

/**
 * Payment Events
 */
export const PAYMENT_EVENTS = {
  CHECKOUT_INITIATED: 'checkout_initiated',
  CHECKOUT_COMPLETED: 'checkout_completed',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
} as const;

/**
 * Dashboard Events
 */
export const DASHBOARD_EVENTS = {
  DASHBOARD_VIEWED: 'dashboard_viewed',
  SETTINGS_VIEWED: 'settings_viewed',
  PROFILE_VIEWED: 'profile_viewed',
  FEATURE_USED: 'feature_used',
} as const;

/**
 * Engagement Events
 */
export const ENGAGEMENT_EVENTS = {
  PAGE_VIEWED: 'page_viewed',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted',
  LINK_CLICKED: 'link_clicked',
} as const;

/**
 * All event names combined
 */
export const ANALYTICS_EVENTS = {
  ...AUTH_EVENTS,
  ...MARKETING_EVENTS,
  ...PAYMENT_EVENTS,
  ...DASHBOARD_EVENTS,
  ...ENGAGEMENT_EVENTS,
} as const;

/**
 * Type for all valid event names
 */
export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Helper to check if an event name is valid
 */
export function isValidEventName(eventName: string): eventName is AnalyticsEventName {
  return Object.values(ANALYTICS_EVENTS).includes(eventName as AnalyticsEventName);
}

/**
 * Event categories for organization
 */
export enum EventCategory {
  AUTH = 'authentication',
  MARKETING = 'marketing',
  PAYMENT = 'payment',
  DASHBOARD = 'dashboard',
  ENGAGEMENT = 'engagement',
}

/**
 * Get event category from event name
 */
export function getEventCategory(eventName: AnalyticsEventName): EventCategory {
  if (Object.values(AUTH_EVENTS).includes(eventName)) {
    return EventCategory.AUTH;
  }
  if (Object.values(MARKETING_EVENTS).includes(eventName)) {
    return EventCategory.MARKETING;
  }
  if (Object.values(PAYMENT_EVENTS).includes(eventName)) {
    return EventCategory.PAYMENT;
  }
  if (Object.values(DASHBOARD_EVENTS).includes(eventName)) {
    return EventCategory.DASHBOARD;
  }
  return EventCategory.ENGAGEMENT;
}
