# PostHog Analytics Best Practices

Guidelines for effective and maintainable analytics implementation.

## Table of Contents

- [Event Tracking Strategy](#event-tracking-strategy)
- [Performance Optimization](#performance-optimization)
- [Testing Analytics](#testing-analytics)
- [Client-Side vs Server-Side](#client-side-vs-server-side)
- [Error Handling](#error-handling)
- [Common Pitfalls](#common-pitfalls)
- [Dashboard Organization](#dashboard-organization)

## Event Tracking Strategy

### What to Track

**High-Value Events** (Priority 1):
- ✅ User signups
- ✅ Subscription changes
- ✅ Payment events
- ✅ Key feature usage
- ✅ Conversion funnel steps

**Medium-Value Events** (Priority 2):
- ✅ Page views
- ✅ CTA clicks
- ✅ Form submissions
- ✅ Navigation clicks

**Low-Value Events** (Priority 3):
- ⚠️ Hover events
- ⚠️ Scroll depth
- ⚠️ Mouse movements
- ⚠️ Every button click

### What NOT to Track

**Avoid Over-Tracking**:
- ❌ Every single click/interaction
- ❌ Repetitive events (e.g., auto-refresh)
- ❌ Technical errors (use error logging instead)
- ❌ Performance metrics (use dedicated tools)
- ❌ Bot traffic

**Avoid PII**:
- ❌ Passwords
- ❌ Credit card numbers
- ❌ Personal documents
- ❌ Private messages

### Event Naming

**✅ Good Examples**:
```typescript
'user_signed_up'
'subscription_created'
'feature_used'
'cta_clicked'
```

**❌ Bad Examples**:
```typescript
'UserSignedUp'           // Wrong case
'user-signed-up'         // Wrong separator
'Subscription Created'   // Spaces and wrong case
'click'                  // Too vague
```

**Best Practices**:
1. Use snake_case
2. Be specific but concise
3. Use past tense for completed actions
4. Group related events with prefixes

### Event Properties

**✅ Good Properties**:
```typescript
{
  plan: 'pro',
  amount: 2900,
  interval: 'month',
  currency: 'USD',
  source: 'pricing_page'
}
```

**❌ Bad Properties**:
```typescript
{
  p: 'pro',              // Unclear abbreviation
  price: '$29',          // String instead of number
  everything: {          // Nested too deep
    nested: {
      too: {
        deep: true
      }
    }
  }
}
```

**Best Practices**:
1. Use descriptive property names
2. Keep values simple (strings, numbers, booleans)
3. Avoid deep nesting
4. Use consistent units (e.g., cents for money)
5. Include context (page, source, etc.)

## Performance Optimization

### Bundle Size

PostHog adds ~28KB gzipped. To minimize impact:

```typescript
// ✅ Good: Lazy load PostHog
const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const { initPostHog } = await import('@/lib/analytics/client');
    initPostHog();
  }
};
```

### Event Batching

PostHog automatically batches events:
- Default: 10 events OR 10 seconds
- Don't disable batching unless necessary

```typescript
// Events are automatically batched
analytics.track('event_1');
analytics.track('event_2');
analytics.track('event_3');
// Sent together after 10 events or 10 seconds
```

### Debouncing

For high-frequency events:

```typescript
import { debounce } from 'lodash';

const trackScroll = debounce(() => {
  analytics.track('scroll_depth', {
    depth: window.scrollY,
  });
}, 1000);

window.addEventListener('scroll', trackScroll);
```

### Non-Blocking Tracking

Always track asynchronously:

```typescript
// ✅ Good: Fire-and-forget
const handleClick = () => {
  analytics.track('button_clicked');
  // Continue with business logic
  submitForm();
};

// ❌ Bad: Awaiting analytics
const handleClick = async () => {
  await analytics.track('button_clicked');
  submitForm(); // Delayed!
};
```

### Memory Management

```typescript
// Clean up event listeners
useEffect(() => {
  const handleClick = () => {
    analytics.track('event');
  };

  window.addEventListener('click', handleClick);

  return () => {
    window.removeEventListener('click', handleClick);
  };
}, []);
```

## Testing Analytics

### Development Testing

```bash
# Enable debug mode
NODE_ENV=development

# Check console logs
[Analytics] Event tracked: page_viewed { page_path: '/' }
```

### Manual Testing Checklist

- [ ] Events appear in console (dev mode)
- [ ] Events appear in PostHog dashboard
- [ ] User identification works after sign in
- [ ] Session resets after sign out
- [ ] Page views tracked on navigation
- [ ] CTAs tracked on click
- [ ] Properties are correct

### Automated Testing

```typescript
// Mock PostHog in tests
jest.mock('@/lib/analytics', () => ({
  useAnalytics: () => ({
    track: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
  }),
}));

// Test component
it('tracks CTA click', () => {
  const { track } = useAnalytics();
  const { getByText } = render(<CTAButton />);

  fireEvent.click(getByText('Get Started'));

  expect(track).toHaveBeenCalledWith('cta_clicked', {
    cta_location: 'hero_section',
  });
});
```

### Verify in Production

```typescript
// Add to production monitoring
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (error) => {
    if (error.message.includes('PostHog')) {
      // Alert team about analytics issues
      console.error('Analytics error:', error);
    }
  });
}
```

## Client-Side vs Server-Side

### When to Use Client-Side

**Use `AnalyticsService` for**:
- ✅ User interactions (clicks, form submissions)
- ✅ Page views
- ✅ Real-time events
- ✅ Browser-specific data

```typescript
import { useAnalytics } from '@/lib/analytics';

function Component() {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.trackCTAClick('hero_section', 'Get Started');
  };

  return <button onClick={handleClick}>Get Started</button>;
}
```

### When to Use Server-Side

**Use `ServerAnalyticsService` for**:
- ✅ Authentication events (webhooks)
- ✅ Payment events (webhooks)
- ✅ Critical business events
- ✅ Events that must not be missed

```typescript
import { ServerAnalyticsService } from '@/lib/analytics/server-service';

// In Clerk webhook handler
export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'user.created') {
    await ServerAnalyticsService.trackSignUp(
      event.data.id,
      event.data.email_addresses[0].email_address
    );
  }

  return Response.json({ success: true });
}
```

### Comparison

| Aspect | Client-Side | Server-Side |
|--------|-------------|-------------|
| **Reliability** | Can be blocked by ad blockers | 100% reliable |
| **Speed** | Fast (runs in browser) | Depends on server |
| **Context** | Has browser/user data | Limited to server data |
| **Security** | Public API key | Private API key |
| **Use Case** | User interactions | Critical events |

## Error Handling

### Graceful Degradation

Analytics should never break your app:

```typescript
export class AnalyticsService {
  static track(event: string, properties?: EventProperties): void {
    try {
      const posthog = getPostHog();
      if (!posthog) return; // Silently fail

      posthog.capture(event, properties);
    } catch (error) {
      // Log error but don't throw
      console.error('[Analytics] Failed to track:', error);
    }
  }
}
```

### Error Logging

```typescript
import { AnalyticsTrackingError } from '@/lib/analytics/errors';

try {
  analytics.track('event_name', properties);
} catch (error) {
  if (error instanceof AnalyticsTrackingError) {
    // Handle analytics-specific error
    console.error('Analytics error:', error.eventName, error.message);
  }
}
```

### Activation Flag

Use the master switch to disable analytics if needed:

```bash
# .env.local
POSTHOG_ACTIVATED=false  # Completely disable analytics
```

## Common Pitfalls

### ❌ Pitfall 1: Tracking Too Much

**Problem**:
```typescript
// Tracking every single interaction
<div
  onClick={() => analytics.track('div_clicked')}
  onMouseEnter={() => analytics.track('div_hovered')}
  onMouseLeave={() => analytics.track('div_unhovered')}
>
```

**Solution**:
```typescript
// Track only meaningful interactions
<button onClick={() => analytics.trackCTAClick('section', 'Sign Up')}>
  Sign Up
</button>
```

### ❌ Pitfall 2: Blocking User Actions

**Problem**:
```typescript
const handleSubmit = async () => {
  await analytics.track('form_submitted'); // Blocks form submission
  submitForm();
};
```

**Solution**:
```typescript
const handleSubmit = () => {
  analytics.track('form_submitted'); // Fire-and-forget
  submitForm(); // Immediate
};
```

### ❌ Pitfall 3: Tracking PII

**Problem**:
```typescript
analytics.track('form_submitted', {
  email: user.email,
  password: formData.password, // NEVER!
  credit_card: formData.cc, // NEVER!
});
```

**Solution**:
```typescript
analytics.track('form_submitted', {
  form_type: 'checkout',
  has_email: true,
  has_payment: true,
});
```

### ❌ Pitfall 4: Inconsistent Naming

**Problem**:
```typescript
analytics.track('userSignedUp');
analytics.track('user_signed_in');
analytics.track('User Signed Out');
```

**Solution**:
```typescript
analytics.track('user_signed_up');
analytics.track('user_signed_in');
analytics.track('user_signed_out');
```

### ❌ Pitfall 5: Missing Error Handling

**Problem**:
```typescript
const posthog = getPostHog()!; // Will crash if null
posthog.capture('event');
```

**Solution**:
```typescript
const posthog = getPostHog();
if (!posthog) return;
posthog.capture('event');
```

## Dashboard Organization

### Create Insights

Group related events into insights:

1. **Conversion Funnel**:
   - `user_signed_up` → `subscription_created`

2. **Feature Adoption**:
   - Track key feature usage over time

3. **User Engagement**:
   - Page views, session duration, return rate

### Set Up Dashboards

Create dashboards for:
- **Marketing**: Acquisition, conversion rates
- **Product**: Feature usage, retention
- **Revenue**: Subscriptions, upgrades, churn

### Configure Alerts

Alert on:
- Drop in signups
- Spike in errors
- Low feature adoption

## Code Organization

### Keep Analytics Separate

```
src/
├── lib/
│   ├── analytics/       # All analytics code here
│   │   ├── client.ts
│   │   ├── service.ts
│   │   ├── events.ts
│   │   └── ...
│   └── ...
```

### Use Constants

```typescript
// ✅ Good
import { AUTH_EVENTS } from '@/lib/analytics/events';
analytics.track(AUTH_EVENTS.USER_SIGNED_UP);

// ❌ Bad
analytics.track('user_signed_up'); // Typo-prone
```

### Type Safety

```typescript
// Use TypeScript types
import type { EventProperties } from '@/lib/analytics/types';

function trackEvent(properties: EventProperties) {
  analytics.track('event_name', properties);
}
```

## Documentation

### Keep Event Catalog Updated

When adding new events:
1. Update `src/lib/analytics/events.ts`
2. Document in `docs/analytics/events.md`
3. Add to dashboards
4. Test thoroughly

### Add Code Comments

```typescript
/**
 * Track user sign up event
 * Called from Clerk webhook (server-side)
 *
 * @param userId - Clerk user ID
 * @param email - User email address
 */
static async trackSignUp(userId: string, email: string): Promise<void> {
  // Implementation
}
```

## Monitoring

### Track Analytics Health

```typescript
// Monitor analytics initialization
if (process.env.NODE_ENV === 'production') {
  if (!isAnalyticsEnabled()) {
    console.warn('Analytics is disabled in production');
  }
}
```

### Regular Audits

Monthly checklist:
- [ ] Review event volume
- [ ] Check for broken tracking
- [ ] Verify user identification
- [ ] Clean up unused events
- [ ] Update documentation

## Additional Resources

- [PostHog Best Practices](https://posthog.com/docs/best-practices)
- [Event Naming Conventions](https://posthog.com/docs/data/events#event-naming)
- [PostHog API Reference](https://posthog.com/docs/api)

## Summary

**Key Takeaways**:
1. Track strategically, not everything
2. Keep events simple and consistent
3. Never block user actions
4. Handle errors gracefully
5. Test thoroughly
6. Document everything
7. Monitor and maintain
