/**
 * useAnalytics Hook
 *
 * React hook for accessing analytics methods in components.
 */

'use client';

import { useCallback } from 'react';
import { AnalyticsService } from '../service';
import type { EventProperties, UserTraits } from '../types';

/**
 * Hook for analytics operations
 *
 * @example
 * function MyComponent() {
 *   const analytics = useAnalytics();
 *
 *   const handleClick = () => {
 *     analytics.track('button_clicked', { button: 'submit' });
 *   };
 *
 *   return <button onClick={handleClick}>Submit</button>;
 * }
 */
export function useAnalytics() {
  const track = useCallback((eventName: string, properties?: EventProperties) => {
    AnalyticsService.track(eventName, properties);
  }, []);

  const identify = useCallback((userId: string, traits?: UserTraits) => {
    AnalyticsService.identify(userId, traits);
  }, []);

  const reset = useCallback(() => {
    AnalyticsService.reset();
  }, []);

  const trackCTAClick = useCallback((location: string, text: string, additionalProps?: EventProperties) => {
    AnalyticsService.trackCTAClick(location, text, additionalProps);
  }, []);

  const trackPricingView = useCallback((plan?: string) => {
    AnalyticsService.trackPricingView(plan);
  }, []);

  const trackFeatureExplore = useCallback((featureName: string, section?: string) => {
    AnalyticsService.trackFeatureExplore(featureName, section);
  }, []);

  const trackHeroCTAClick = useCallback((ctaText: string) => {
    AnalyticsService.trackHeroCTAClick(ctaText);
  }, []);

  const trackGitHubLinkClick = useCallback((location: string) => {
    AnalyticsService.trackGitHubLinkClick(location);
  }, []);

  const trackWaitlistJoin = useCallback((email: string) => {
    AnalyticsService.trackWaitlistJoin(email);
  }, []);

  const trackNavigationClick = useCallback((item: string, destination: string) => {
    AnalyticsService.trackNavigationClick(item, destination);
  }, []);

  const trackSignIn = useCallback((method?: string) => {
    AnalyticsService.trackSignIn(method);
  }, []);

  const trackSignOut = useCallback(() => {
    AnalyticsService.trackSignOut();
  }, []);

  const trackProfileUpdate = useCallback((changes: string[]) => {
    AnalyticsService.trackProfileUpdate(changes);
  }, []);

  const trackCheckoutInitiated = useCallback(
    (plan: string, amount?: number, interval?: 'month' | 'year') => {
      AnalyticsService.trackCheckoutInitiated(plan, amount, interval);
    },
    []
  );

  const trackDashboardView = useCallback(() => {
    AnalyticsService.trackDashboardView();
  }, []);

  const trackSettingsView = useCallback(() => {
    AnalyticsService.trackSettingsView();
  }, []);

  const trackFeatureUsed = useCallback((featureName: string, properties?: any) => {
    AnalyticsService.trackFeatureUsed(featureName, properties);
  }, []);

  const trackPageView = useCallback((path?: string, title?: string) => {
    AnalyticsService.trackPageView(path, title);
  }, []);

  const optIn = useCallback(() => {
    AnalyticsService.optIn();
  }, []);

  const optOut = useCallback(() => {
    AnalyticsService.optOut();
  }, []);

  const hasOptedOut = useCallback(() => {
    return AnalyticsService.hasOptedOut();
  }, []);

  return {
    track,
    identify,
    reset,
    trackCTAClick,
    trackPricingView,
    trackFeatureExplore,
    trackHeroCTAClick,
    trackGitHubLinkClick,
    trackWaitlistJoin,
    trackNavigationClick,
    trackSignIn,
    trackSignOut,
    trackProfileUpdate,
    trackCheckoutInitiated,
    trackDashboardView,
    trackSettingsView,
    trackFeatureUsed,
    trackPageView,
    optIn,
    optOut,
    hasOptedOut,
  };
}
