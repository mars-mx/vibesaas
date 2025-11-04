/**
 * Analytics Test Page
 *
 * Visit this page to verify PostHog tracking is working.
 * Check browser console for tracking logs (in development mode).
 */

'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/lib/analytics';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AnalyticsTestPage() {
  const analytics = useAnalytics();
  const [events, setEvents] = useState<string[]>([]);

  // Log page view on mount
  useEffect(() => {
    setEvents(prev => [...prev, `✅ Page viewed: /analytics-test at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleTestEvent = (eventName: string) => {
    const timestamp = new Date().toLocaleTimeString();

    switch (eventName) {
      case 'cta_click':
        analytics.trackCTAClick('test_page', 'Test Button');
        setEvents(prev => [...prev, `✅ CTA clicked: test_page at ${timestamp}`]);
        break;
      case 'custom':
        analytics.track('custom_test_event', {
          test: true,
          page: 'analytics-test',
          timestamp
        });
        setEvents(prev => [...prev, `✅ Custom event tracked at ${timestamp}`]);
        break;
      case 'feature':
        analytics.trackFeatureUsed('analytics_testing', {
          interaction_type: 'click'
        });
        setEvents(prev => [...prev, `✅ Feature used tracked at ${timestamp}`]);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              📊 Analytics Test Page
            </h1>
            <p className="text-lg text-muted-foreground">
              This page automatically tracked a page view when you landed here.
              <br />
              Open your browser console to see tracking logs in development mode.
            </p>
          </div>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 How to Verify Tracking</CardTitle>
              <CardDescription>
                Follow these steps to confirm PostHog is working
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Development Mode:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Open browser DevTools (F12)</li>
                  <li>Go to Console tab</li>
                  <li>Look for messages like: <code className="text-xs bg-muted px-1 py-0.5 rounded">[Analytics] Event tracked: page_viewed</code></li>
                  <li>Click the buttons below to test more events</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">PostHog Dashboard:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Go to your PostHog project</li>
                  <li>Navigate to Events section</li>
                  <li>Filter by event name: <code className="text-xs bg-muted px-1 py-0.5 rounded">page_viewed</code></li>
                  <li>You should see this page visit listed</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Test Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Test Different Events</CardTitle>
              <CardDescription>
                Click these buttons to trigger different tracking events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleTestEvent('cta_click')}
                  className="w-full"
                >
                  Test CTA Click
                </Button>
                <Button
                  onClick={() => handleTestEvent('feature')}
                  variant="outline"
                  className="w-full"
                >
                  Test Feature Usage
                </Button>
                <Button
                  onClick={() => handleTestEvent('custom')}
                  variant="secondary"
                  className="w-full"
                >
                  Test Custom Event
                </Button>
              </div>

              {/* Event Log */}
              {events.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Event Log:</h4>
                  <div className="space-y-1 text-sm font-mono">
                    {events.map((event, index) => (
                      <div key={index} className="text-muted-foreground">
                        {event}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Card */}
          <Card>
            <CardHeader>
              <CardTitle>🔄 Test Page Navigation Tracking</CardTitle>
              <CardDescription>
                Navigate to different pages to see automatic page view tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">Pricing</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                💡 Each navigation will automatically trigger a <code className="text-xs bg-muted px-1 py-0.5 rounded">page_viewed</code> event
              </p>
            </CardContent>
          </Card>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Configuration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Analytics Enabled:</span>
                  <span className="font-mono">
                    {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_ACTIVATED === 'true' ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="font-mono">{process.env.NODE_ENV || 'development'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PostHog Host:</span>
                  <span className="font-mono text-xs">
                    {process.env.NEXT_PUBLIC_POSTHOG_HOST || 'Not configured'}
                  </span>
                </div>
              </div>

              {process.env.NEXT_PUBLIC_POSTHOG_ACTIVATED !== 'true' && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
                  ⚠️ Analytics is disabled. Set <code className="bg-yellow-500/20 px-1 py-0.5 rounded">POSTHOG_ACTIVATED=true</code> in your .env.local
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center">
            <Button variant="ghost" asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
