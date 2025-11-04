# PostHog Analytics Privacy & GDPR Compliance

Guide to ensuring privacy-compliant analytics implementation.

## Table of Contents

- [Overview](#overview)
- [GDPR Compliance](#gdpr-compliance)
- [Cookie Policy](#cookie-policy)
- [Consent Management](#consent-management)
- [Data Retention](#data-retention)
- [User Rights](#user-rights)
- [Implementation Guide](#implementation-guide)

## Overview

VibeSaaS's PostHog integration is designed with privacy-first principles:

- ✅ Configurable activation flag
- ✅ Optional cookieless mode
- ✅ EU data residency available
- ✅ User opt-out support
- ✅ No PII tracking by default
- ✅ Session replay with masking

## GDPR Compliance

### Requirements Checklist

- [ ] **Obtain Consent**: Ask users before tracking (if required by law)
- [ ] **Data Processing Agreement**: Sign DPA with PostHog
- [ ] **Privacy Policy**: Disclose analytics usage
- [ ] **Cookie Notice**: Inform users about cookies
- [ ] **Opt-Out Mechanism**: Allow users to disable tracking
- [ ] **Data Access**: Provide user data on request
- [ ] **Right to Deletion**: Delete user data on request
- [ ] **Data Minimization**: Only collect necessary data

### Current Implementation Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| Activation Flag | ✅ Implemented | `POSTHOG_ACTIVATED` env variable |
| User Identification | ✅ Implemented | Only authenticated users |
| Opt-Out Support | ✅ Implemented | `optOut()` / `optIn()` methods |
| Cookieless Mode | ✅ Available | `NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE=true` |
| EU Hosting | ✅ Available | `NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com` |
| Session Masking | ✅ Implemented | Masks all inputs by default |
| Consent UI | ⚠️ Not Implemented | See [Consent Management](#consent-management) |

## Cookie Policy

### Cookies Used by PostHog

When `NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE=false` (default):

| Cookie Name | Purpose | Duration | Type |
|-------------|---------|----------|------|
| `ph_*_posthog` | Session tracking | 1 year | First-party |
| `ph_*_posthog_session` | Session ID | 30 minutes | First-party |

### Cookieless Mode

To operate without cookies:

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE=true
```

This enables:
- Memory-only persistence (session-scoped)
- No cross-session tracking
- GDPR-friendly by default
- Reduced tracking accuracy

**Tradeoffs**:
- ✅ No consent required in many jurisdictions
- ❌ Cannot track returning users
- ❌ Session ends on browser refresh

## Consent Management

### Recommended Approach

We recommend implementing cookie consent before enabling full tracking:

```typescript
// Example consent flow (not implemented yet)
import { AnalyticsService } from '@/lib/analytics';

function CookieConsent() {
  const handleAccept = () => {
    AnalyticsService.optIn();
    localStorage.setItem('analytics-consent', 'true');
  };

  const handleDecline = () => {
    AnalyticsService.optOut();
    localStorage.setItem('analytics-consent', 'false');
  };

  return (
    <div>
      <p>We use cookies to improve your experience.</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
    </div>
  );
}
```

### Checking Consent Status

```typescript
import { AnalyticsService } from '@/lib/analytics';

const hasOptedOut = AnalyticsService.hasOptedOut();

if (!hasOptedOut) {
  // User has consented, track event
  AnalyticsService.track('event_name', {});
}
```

### Storing Consent

Store user consent preferences in:
1. **Browser**: `localStorage` or cookies
2. **Database**: Convex user table (recommended)

#### Convex Schema Example

```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({
    // ... existing fields
    analyticsConsent: v.optional(v.boolean()),
    analyticsConsentDate: v.optional(v.number()),
  }),
});
```

## Data Retention

### PostHog Default Retention

- **Events**: Unlimited (free and paid plans)
- **Session Recordings**: 30 days (free), custom (paid)
- **Person Profiles**: Unlimited

### Custom Retention Policy

Configure in PostHog dashboard:
1. Go to **Project Settings**
2. Navigate to **Data Retention**
3. Set custom retention periods:
   - Events: 30 days, 90 days, 1 year, unlimited
   - Recordings: 7 days, 30 days, 90 days

### Recommended Settings

**For GDPR Compliance**:
- Events: 90 days (sufficient for analytics)
- Session Recordings: 30 days (debugging period)
- Person Profiles: Delete on request

## User Rights

### Right to Access

Provide users with their data:

```typescript
// Server-side endpoint
import { posthogServer } from '@/lib/analytics/server-client';

export async function getUserData(userId: string) {
  // PostHog doesn't have a direct "get user data" API
  // Export data manually from dashboard or use PostHog API
  // https://posthog.com/docs/api/events
}
```

**Manual Process**:
1. Go to PostHog dashboard
2. Navigate to **Persons**
3. Search for user by email/ID
4. Export event history

### Right to Deletion

Delete user data on request:

```typescript
import { posthogServer } from '@/lib/analytics/server-client';

export async function deleteUserData(userId: string) {
  if (posthogServer) {
    // PostHog automatically deletes persons who haven't been seen
    // For immediate deletion, contact PostHog support or use API
  }
}
```

**Options**:
1. **Automatic**: User data expires after inactivity (configured in PostHog)
2. **Manual**: Delete from PostHog dashboard
3. **API**: Use PostHog [delete person API](https://posthog.com/docs/api/persons)

### Right to Opt-Out

Allow users to opt out:

```typescript
// In user settings component
import { useAnalytics } from '@/lib/analytics';

function PrivacySettings() {
  const analytics = useAnalytics();
  const [hasOptedOut, setHasOptedOut] = useState(
    analytics.hasOptedOut()
  );

  const handleToggle = () => {
    if (hasOptedOut) {
      analytics.optIn();
      setHasOptedOut(false);
    } else {
      analytics.optOut();
      setHasOptedOut(true);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={!hasOptedOut}
          onChange={handleToggle}
        />
        Enable Analytics
      </label>
    </div>
  );
}
```

## Implementation Guide

### Phase 1: Privacy-First Setup (Current)

**Current Status**: ✅ Implemented

```bash
# Minimal tracking, authenticated users only
POSTHOG_ACTIVATED=true
NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE=false
```

**What's Tracked**:
- Only authenticated users (via Clerk)
- Basic events (page views, CTAs)
- No anonymous tracking
- No session recordings

**GDPR Status**: ⚠️ Consent recommended but not strictly required (depends on jurisdiction)

### Phase 2: Cookie Consent (Recommended)

**To Implement**:

1. **Add Consent Banner Component**

```typescript
// src/components/common/cookie-consent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AnalyticsService } from '@/lib/analytics';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (!consent) {
      setShow(true);
    } else if (consent === 'true') {
      AnalyticsService.optIn();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics-consent', 'true');
    AnalyticsService.optIn();
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('analytics-consent', 'false');
    AnalyticsService.optOut();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use analytics to improve your experience.{' '}
          <a href="/privacy" className="underline">
            Learn more
          </a>
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
```

2. **Add to Layout**

```tsx
// src/app/layout.tsx
import { CookieConsent } from '@/components/common/cookie-consent';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
```

3. **Store in Database**

```typescript
// convex/users.ts
import { mutation } from './_generated/server';

export const updateAnalyticsConsent = mutation({
  args: {
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(user._id, {
      analyticsConsent: args.consent,
      analyticsConsentDate: Date.now(),
    });
  },
});
```

### Phase 3: Full Compliance (Future)

1. **Session Recordings** (only with explicit consent)
2. **Anonymous Tracking** (with consent)
3. **Data Export API** (for user requests)
4. **Automated Deletion** (for GDPR requests)

## Privacy Policy Template

Add to your privacy policy:

```
### Analytics

We use PostHog, a privacy-friendly analytics platform, to understand how users
interact with our service. PostHog collects:

- Page views and navigation patterns
- Button clicks and feature usage
- Device and browser information
- General location (country-level)

We DO NOT collect:
- Personal identifiable information (PII)
- Passwords or sensitive data
- Payment information
- Private messages or content

You can opt out of analytics at any time in your account settings.

Data is stored on PostHog's EU servers (Frankfurt, Germany) and retained for
90 days. For more information, see PostHog's privacy policy:
https://posthog.com/privacy
```

## EU Data Residency

To ensure GDPR compliance:

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

**Benefits**:
- Data stored in EU (Frankfurt, AWS eu-central-1)
- GDPR-compliant by design
- Faster response times for EU users
- Meets data residency requirements

## Sensitive Data Handling

### What NOT to Track

**Never** send these to PostHog:
- ❌ Passwords
- ❌ Credit card numbers
- ❌ Social security numbers
- ❌ API keys or tokens
- ❌ Private messages
- ❌ Health information
- ❌ Financial records

### Data Sanitization

Always sanitize before tracking:

```typescript
// ❌ Bad
analytics.track('form_submitted', {
  email: user.email,
  password: formData.password, // NEVER!
});

// ✅ Good
analytics.track('form_submitted', {
  form_type: 'contact',
  has_email: !!formData.email,
});
```

### Session Recording Masking

Session recordings automatically mask:
- All input fields (`maskAllInputs: true`)
- Elements with `data-ph-mask` attribute
- Credit card fields
- Password fields

```tsx
// Additional masking
<div data-ph-mask>
  Sensitive content here
</div>
```

## Compliance Checklist

Before going to production:

- [ ] Privacy policy updated
- [ ] Cookie consent banner (if required)
- [ ] Opt-out mechanism in settings
- [ ] Data retention policy configured
- [ ] EU hosting enabled (if needed)
- [ ] Session recording disabled (or with consent)
- [ ] PII sanitization verified
- [ ] DPA signed with PostHog
- [ ] Team trained on privacy practices

## Additional Resources

- [PostHog GDPR Compliance](https://posthog.com/docs/privacy/gdpr-compliance)
- [PostHog Privacy Policy](https://posthog.com/privacy)
- [GDPR Official Text](https://gdpr-info.eu/)
- [Cookie Consent Best Practices](https://www.cookiebot.com/en/gdpr-cookies/)

## Support

For privacy-related questions:
- Legal: Consult your legal team
- PostHog: support@posthog.com (paid plans)
- GDPR: Your local data protection authority
