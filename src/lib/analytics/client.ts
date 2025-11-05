/**
 * PostHog client singleton for browser environment
 * Uses lazy initialization to ensure client-side only execution
 */

'use client';

import posthog from 'posthog-js';
import type { PostHog } from 'posthog-js';
import { AnalyticsConfigError } from './errors';

/**
 * Global type augmentation for PostHog client
 */
const globalForPostHog = globalThis as typeof globalThis & {
  __posthog?: PostHog;
  __posthogInitialized?: boolean;
};

/**
 * Check if client-side analytics is enabled
 * Uses NEXT_PUBLIC_POSTHOG_ACTIVATED flag
 * When disabled, all analytics operations will be no-ops
 */
export const isAnalyticsEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_POSTHOG_ACTIVATED === 'true';
};

/**
 * Get PostHog configuration from environment variables
 */
export const getPostHogConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  const enableSessionReplay =
    process.env.NEXT_PUBLIC_POSTHOG_ENABLE_SESSION_REPLAY === 'true';
  const disableCookie = process.env.NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE === 'true';

  if (!apiKey) {
    throw new AnalyticsConfigError(
      'NEXT_PUBLIC_POSTHOG_API_KEY environment variable is not set. ' +
        'Please add it to your .env.local file.'
    );
  }

  return {
    apiKey,
    host,
    enableSessionReplay,
    disableCookie,
    debug: process.env.NODE_ENV === 'development',
  };
};

/**
 * Initialize PostHog client (client-side only)
 * This should be called in a client component or browser environment
 */
export function initPostHog(): PostHog | null {
  // Skip if already initialized
  if (globalForPostHog.__posthogInitialized) {
    return globalForPostHog.__posthog || null;
  }

  // Skip if not in browser
  if (typeof window === 'undefined') {
    return null;
  }

  // Skip if analytics is disabled
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics] PostHog is disabled via NEXT_PUBLIC_POSTHOG_ACTIVATED flag');
    return null;
  }

  try {
    const config = getPostHogConfig();

    posthog.init(config.apiKey, {
      api_host: config.host,
      loaded: (ph) => {
        if (config.debug) {
          ph.debug();
          console.log('[Analytics] PostHog initialized in debug mode');
        }
      },
      capture_pageview: false, // We'll handle page views manually
      capture_pageleave: true,
      disable_session_recording: !config.enableSessionReplay,
      persistence: config.disableCookie ? 'memory' : 'localStorage+cookie',
      ...(config.disableCookie && {
        disable_cookie: true,
      }),
      session_recording: config.enableSessionReplay
        ? {
            maskAllInputs: true,
            maskTextSelector: '[data-ph-mask]',
            recordCrossOriginIframes: false,
          }
        : undefined,
    });

    globalForPostHog.__posthog = posthog;
    globalForPostHog.__posthogInitialized = true;

    return posthog;
  } catch (error) {
    console.error('[Analytics] Failed to initialize PostHog:', error);
    return null;
  }
}

/**
 * Get PostHog client instance
 * Returns null if not initialized or analytics is disabled
 */
export function getPostHog(): PostHog | null {
  if (!isAnalyticsEnabled()) {
    return null;
  }

  if (!globalForPostHog.__posthogInitialized) {
    return initPostHog();
  }

  return globalForPostHog.__posthog || null;
}

/**
 * Reset PostHog instance (useful for testing or re-initialization)
 */
export function resetPostHog(): void {
  if (globalForPostHog.__posthog) {
    globalForPostHog.__posthog.reset();
  }
  globalForPostHog.__posthogInitialized = false;
  globalForPostHog.__posthog = undefined;
}
