# PostHog Events Catalog

Complete reference of all tracked events in VibeSaaS.

## Table of Contents

- [Event Naming Convention](#event-naming-convention)
- [Event Categories](#event-categories)
- [Marketing Events](#marketing-events)
- [Authentication Events](#authentication-events)
- [Payment Events](#payment-events)
- [Dashboard Events](#dashboard-events)
- [Engagement Events](#engagement-events)
- [Adding Custom Events](#adding-custom-events)

## Event Naming Convention

All events follow PostHog's recommended snake_case naming convention:

```typescript
// ✅ Good
"user_signed_up"
"cta_clicked"
"subscription_created"

// ❌ Bad
"userSignedUp"
"CTA_Clicked"
"Subscription Created"
```

### Event Structure

```typescript
{
  event: "event_name",        // Required: Event identifier
  properties: {
    // Event-specific properties
    custom_prop: "value",

    // Standard properties (added automatically)
    page_path: "/",
    page_title: "Home",
    timestamp: "2025-01-01T00:00:00Z",

    // User properties (optional)
    $set: {
      email: "user@example.com",
      plan: "pro"
    }
  }
}
```

## Event Categories

Events are organized into the following categories:

| Category | Description | Tracking Location |
|----------|-------------|-------------------|
| Marketing | User acquisition and conversion | Landing pages, CTAs |
| Authentication | User identity and access | Sign up, sign in, sign out |
| Payment | Revenue and subscription | Checkout, upgrades, cancellations |
| Dashboard | Product usage | App features and interactions |
| Engagement | General user behavior | Page views, clicks |

## Marketing Events

Events related to marketing campaigns and user acquisition.

### `cta_clicked`

Tracks when any call-to-action button is clicked.

**Location**: Hero section, pricing cards, footer

**Properties**:
```typescript
{
  cta_location: string;    // Where the CTA is located
  cta_text: string;        // Button text
  page_path?: string;      // Current page
  section?: string;        // Page section
  plan?: string;           // Pricing plan (if applicable)
}
```

**Example**:
```typescript
analytics.trackCTAClick('hero_section', 'Get Started Free', {
  section: 'hero',
});
```

**Triggered By**:
- Hero "Get Started Free" button
- Pricing plan buttons
- Footer CTAs

---

### `pricing_viewed`

Tracks when the pricing page or section is viewed.

**Location**: Pricing section scroll into view

**Properties**:
```typescript
{
  plan?: string;           // Specific plan viewed
  page_path?: string;      // Current page
}
```

**Example**:
```typescript
analytics.trackPricingView('Pro');
```

---

### `feature_explored`

Tracks when a user explores a specific feature description.

**Location**: Features section, marketing pages

**Properties**:
```typescript
{
  feature_name: string;    // Name of the feature
  section?: string;        // Section where explored
  page_path?: string;      // Current page
}
```

**Example**:
```typescript
analytics.trackFeatureExplore('Real-time Sync', 'features_section');
```

---

### `github_link_clicked`

Tracks when the GitHub repository link is clicked.

**Location**: Hero section, navigation

**Properties**:
```typescript
{
  location: string;        // Where the link was clicked
  page_path?: string;      // Current page
}
```

**Example**:
```typescript
analytics.trackGitHubLinkClick('hero_section');
```

---

### `waitlist_joined`

Tracks when a user joins the waitlist.

**Location**: Waitlist signup form

**Properties**:
```typescript
{
  $set: {
    email: string;         // User email
    waitlist: boolean;     // Set to true
  }
}
```

**Example**:
```typescript
analytics.trackWaitlistJoin('user@example.com');
```

---

### `navigation_clicked`

Tracks navigation menu interactions.

**Location**: Header navigation, footer navigation

**Properties**:
```typescript
{
  navigation_item: string; // Menu item clicked
  destination: string;     // Target URL
  page_path?: string;      // Current page
}
```

**Example**:
```typescript
analytics.trackNavigationClick('Pricing', '/pricing');
```

## Authentication Events

Events related to user authentication and identity.

### `user_signed_up`

Tracks when a new user creates an account.

**Location**: Clerk webhook (server-side)

**Properties**:
```typescript
{
  method?: string;         // Auth method ('email', 'google', etc.)
  $set: {
    email: string;
  },
  $set_once: {
    signupDate: string;    // ISO timestamp
  }
}
```

**Example (Server-side)**:
```typescript
await ServerAnalyticsService.trackSignUp(
  userId,
  'user@example.com',
  { method: 'google' }
);
```

**Triggered By**: Clerk `user.created` webhook

---

### `user_signed_in`

Tracks when an existing user signs in.

**Location**: Clerk webhook (server-side) or client-side

**Properties**:
```typescript
{
  method?: string;         // Auth method
}
```

**Example**:
```typescript
analytics.trackSignIn('email');
```

---

### `user_signed_out`

Tracks when a user signs out.

**Location**: Sign out handler

**Properties**: None

**Example**:
```typescript
analytics.trackSignOut();
```

**Note**: Automatically calls `analytics.reset()` after tracking.

---

### `user_profile_updated`

Tracks when a user updates their profile.

**Location**: Profile settings page

**Properties**:
```typescript
{
  fields_updated: string[];  // Array of field names
}
```

**Example**:
```typescript
analytics.trackProfileUpdate(['name', 'email']);
```

## Payment Events

Events related to subscriptions and payments.

### `checkout_initiated`

Tracks when a user starts the checkout process.

**Location**: Pricing page, upgrade prompts

**Properties**:
```typescript
{
  plan: string;            // Plan name
  amount?: number;         // Price in cents
  interval?: 'month' | 'year';
  currency: string;        // Default: 'USD'
}
```

**Example**:
```typescript
analytics.trackCheckoutInitiated('Pro', 2900, 'month');
```

---

### `checkout_completed`

Tracks successful checkout completion.

**Location**: Polar webhook (server-side)

**Properties**:
```typescript
{
  plan: string;
  amount: number;
  interval: 'month' | 'year';
  currency: string;
}
```

---

### `subscription_created`

Tracks when a new subscription is created.

**Location**: Polar webhook (server-side)

**Properties**:
```typescript
{
  subscriptionId: string;
  plan: string;
  amount: number;
  interval: 'month' | 'year';
  productId?: string;
  currency: string;
  $set: {
    plan: string;
    subscriptionStatus: 'active';
  }
}
```

**Example (Server-side)**:
```typescript
await ServerAnalyticsService.trackSubscriptionCreated(userId, {
  subscriptionId: 'sub_123',
  plan: 'Pro',
  amount: 2900,
  interval: 'month',
});
```

---

### `subscription_cancelled`

Tracks when a subscription is cancelled.

**Location**: Polar webhook (server-side)

**Properties**:
```typescript
{
  subscriptionId: string;
  plan: string;
  $set: {
    subscriptionStatus: 'cancelled';
  }
}
```

---

### `subscription_upgraded` / `subscription_downgraded`

Tracks plan changes.

**Location**: Polar webhook (server-side)

**Properties**:
```typescript
{
  subscriptionId: string;
  plan: string;            // New plan
  amount: number;
  interval: 'month' | 'year';
  currency: string;
}
```

---

### `subscription_renewed`

Tracks automatic subscription renewals.

**Location**: Polar webhook (server-side)

**Properties**:
```typescript
{
  subscriptionId: string;
  plan: string;
  amount: number;
  interval: 'month' | 'year';
}
```

## Dashboard Events

Events related to app usage and feature interaction.

### `dashboard_viewed`

Tracks dashboard page views.

**Location**: Dashboard page mount

**Properties**:
```typescript
{
  page_path: string;
}
```

**Example**:
```typescript
analytics.trackDashboardView();
```

---

### `settings_viewed`

Tracks settings page views.

**Location**: Settings page mount

**Properties**:
```typescript
{
  page_path: string;
}
```

---

### `feature_used`

Tracks specific feature usage within the app.

**Location**: Throughout the application

**Properties**:
```typescript
{
  feature_name: string;
  feature_category?: string;
  interaction_type?: 'view' | 'click' | 'submit' | 'toggle';
}
```

**Example**:
```typescript
analytics.trackFeatureUsed('Export Data', {
  feature_category: 'data_management',
  interaction_type: 'click',
});
```

## Engagement Events

General user engagement and behavior tracking.

### `page_viewed`

Tracks page views (automatically tracked).

**Location**: Automatic on route change

**Properties**:
```typescript
{
  page_path: string;
  page_title?: string;
  referrer?: string;
}
```

**Example**:
```typescript
// Automatically tracked by usePageView() hook
// Manual tracking:
analytics.trackPageView('/dashboard', 'Dashboard');
```

---

### `button_clicked`

Generic button click tracking.

**Location**: Any button without specific tracking

**Properties**:
```typescript
{
  button_id?: string;
  button_text?: string;
  page_path?: string;
}
```

---

### `form_submitted`

Tracks form submissions.

**Location**: Contact forms, feedback forms

**Properties**:
```typescript
{
  form_name: string;
  form_type?: string;
  page_path?: string;
}
```

---

### `link_clicked`

Tracks link clicks.

**Location**: External links, internal navigation

**Properties**:
```typescript
{
  link_url: string;
  link_text?: string;
  is_external: boolean;
  page_path?: string;
}
```

## Adding Custom Events

### 1. Define Event Constant

Add to `src/lib/analytics/events.ts`:

```typescript
export const CUSTOM_EVENTS = {
  MY_CUSTOM_EVENT: 'my_custom_event',
} as const;
```

### 2. Create Service Method

Add to `src/lib/analytics/service.ts`:

```typescript
export class AnalyticsService {
  static trackMyCustomEvent(customProp: string): void {
    this.track(CUSTOM_EVENTS.MY_CUSTOM_EVENT, {
      custom_prop: customProp,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 3. Add Hook Method

Add to `src/lib/analytics/hooks/use-analytics.ts`:

```typescript
export function useAnalytics() {
  const trackMyCustomEvent = useCallback((customProp: string) => {
    AnalyticsService.trackMyCustomEvent(customProp);
  }, []);

  return {
    // ... existing methods
    trackMyCustomEvent,
  };
}
```

### 4. Use in Component

```typescript
import { useAnalytics } from '@/lib/analytics/hooks/use-analytics';

function MyComponent() {
  const analytics = useAnalytics();

  const handleAction = () => {
    analytics.trackMyCustomEvent('some value');
  };

  return <button onClick={handleAction}>Track Event</button>;
}
```

## Event Validation

All event properties are validated using Zod schemas:

```typescript
import { ctaClickPropertiesSchema } from '@/lib/analytics/schemas';

// Automatically validated
analytics.trackCTAClick('hero_section', 'Get Started');

// Invalid properties will throw AnalyticsValidationError
analytics.trackCTAClick('', ''); // ❌ Error: CTA location is required
```

## Viewing Events in PostHog

1. Navigate to **Events** in PostHog dashboard
2. Filter by event name
3. Click on event to see:
   - Event properties
   - User who triggered it
   - Timestamp
   - Session recording (if enabled)

## Best Practices

1. **Be Specific**: Use descriptive event names
2. **Consistent Naming**: Always use snake_case
3. **Include Context**: Add relevant properties
4. **Avoid PII**: Don't track sensitive data
5. **Test Events**: Verify events appear in PostHog
6. **Document Changes**: Update this file when adding events

## Related Documentation

- [Setup Guide](./setup.md)
- [Privacy Guide](./privacy.md)
- [Best Practices](./best-practices.md)
