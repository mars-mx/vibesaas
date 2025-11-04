# PostHog Analytics Setup Guide

This guide walks you through setting up PostHog analytics in your VibeSaaS application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Verification](#verification)
- [Next Steps](#next-steps)

## Prerequisites

Before setting up PostHog analytics, ensure you have:

1. **PostHog Account**: Sign up at [posthog.com](https://posthog.com)
2. **Project Created**: Create a new project in PostHog dashboard
3. **API Keys**: Obtain both client-side and server-side API keys

### Getting Your API Keys

1. Navigate to your PostHog project settings
2. Go to "Project API Key" section
3. **Client-side key** (`NEXT_PUBLIC_POSTHOG_API_KEY`): Starts with `phc_`
4. **Server-side key** (`POSTHOG_API_KEY_SERVER`): Starts with `phx_`

## Installation

PostHog packages are already installed in this project:

```json
{
  "dependencies": {
    "posthog-js": "^1.x.x",
    "posthog-node": "^4.x.x"
  }
}
```

If you need to reinstall:

```bash
npm install posthog-js posthog-node
```

## Configuration

### 1. Environment Variables

Add the following variables to your `.env.local` file:

```bash
# PostHog Analytics
# Master activation flag - enables both client and server analytics
POSTHOG_ACTIVATED=true

# Optional: Override client-side activation separately
# If not set, falls back to POSTHOG_ACTIVATED
# NEXT_PUBLIC_POSTHOG_ACTIVATED=true

NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # or https://eu.posthog.com for EU
POSTHOG_API_KEY_SERVER=phx_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Privacy Settings (Optional)
NEXT_PUBLIC_POSTHOG_ENABLE_SESSION_REPLAY=false  # Enable when ready
NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE=false  # Set true for cookieless mode
```

#### Environment Variable Descriptions

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `POSTHOG_ACTIVATED` | Master switch for both server and client analytics | Yes | `false` |
| `NEXT_PUBLIC_POSTHOG_ACTIVATED` | Optional override for client-side only (falls back to `POSTHOG_ACTIVATED`) | No | Uses `POSTHOG_ACTIVATED` |
| `NEXT_PUBLIC_POSTHOG_API_KEY` | Client-side API key | Yes | - |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | Yes | `https://app.posthog.com` |
| `POSTHOG_API_KEY_SERVER` | Server-side API key | Yes | - |
| `NEXT_PUBLIC_POSTHOG_ENABLE_SESSION_REPLAY` | Enable session recording | No | `false` |
| `NEXT_PUBLIC_POSTHOG_DISABLE_COOKIE` | Disable cookies (use memory only) | No | `false` |

**Activation Flag Behavior:**
- If `NEXT_PUBLIC_POSTHOG_ACTIVATED` is set, it controls client-side analytics
- If `NEXT_PUBLIC_POSTHOG_ACTIVATED` is not set, it falls back to `POSTHOG_ACTIVATED`
- This allows you to use a single `POSTHOG_ACTIVATED=true` flag for unified configuration
- Or set different values to control client and server independently

### 2. PostHog Host Selection

Choose the appropriate host based on your requirements:

- **US Cloud**: `https://app.posthog.com` (default)
- **EU Cloud**: `https://eu.posthog.com` (GDPR-compliant, data stored in Frankfurt)
- **Self-Hosted**: `https://your-posthog-instance.com`

**Recommendation**: Use EU Cloud if you have European users to ensure GDPR compliance.

### 3. Provider Integration

The PostHogProvider is already integrated in the root layout (`src/app/layout.tsx`):

```tsx
import { PostHogProvider } from "@/components/providers/posthog-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexClerkProvider>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </ConvexClerkProvider>
      </body>
    </html>
  );
}
```

**What the Provider Does:**
- Initializes PostHog on client-side mount
- Automatically identifies authenticated users from Clerk
- Tracks page views on route changes
- Resets session on sign out

### 4. Import Paths

**IMPORTANT:** Use the correct import path based on where you're tracking:

**Client-Side (Components, Hooks):**
```typescript
// For React hooks
import { useAnalytics } from '@/lib/analytics/hooks/use-analytics';
import { usePageView } from '@/lib/analytics/hooks/use-page-view';

// For direct service usage (non-hook)
import { AnalyticsService } from '@/lib/analytics';
```

**Server-Side (API Routes, Server Actions, Webhooks):**
```typescript
import { ServerAnalyticsService } from '@/lib/analytics/server';
```

**Why separate imports?**
- Client imports are safe for browser bundles
- Server imports include Node.js-only code (posthog-node)
- Mixing them causes build errors

## Verification

### 1. Check Analytics Initialization

Open your browser's developer console and look for:

```
[Analytics] PostHog initialized in debug mode
```

This message confirms PostHog is running (in development mode).

### 2. Verify Event Tracking

#### In Development

With `NODE_ENV=development`, all events are logged to console:

```
[Analytics] Event tracked: page_viewed { page_path: '/', ... }
[Analytics] Event tracked: cta_clicked { cta_location: 'hero_section', ... }
```

#### In PostHog Dashboard

1. Navigate to your PostHog project
2. Go to "Events" section
3. You should see events appearing in real-time
4. Click on an event to see its properties

### 3. Verify User Identification

After signing in with Clerk:

```
[Analytics] User identified: user_2xxxxx { email: 'user@example.com', ... }
```

In PostHog dashboard:
1. Go to "Persons" section
2. Find your user by email
3. Verify properties are set correctly

### 4. Test Event Flow

Test the complete analytics flow:

```bash
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Open DevTools console
# 4. Click a CTA button
# 5. Verify console log shows event
# 6. Check PostHog dashboard for event
```

## Common Issues & Solutions

### Issue: "PostHog is disabled via POSTHOG_ACTIVATED flag"

**Solution**: Set `POSTHOG_ACTIVATED=true` in your `.env.local`

### Issue: "NEXT_PUBLIC_POSTHOG_API_KEY environment variable is not set"

**Solution**:
1. Verify `.env.local` exists in project root
2. Ensure API key is set correctly
3. Restart development server after adding variables

### Issue: Events not appearing in PostHog dashboard

**Checklist**:
- ✅ Verify API key is correct
- ✅ Check network tab for failed requests
- ✅ Ensure `POSTHOG_ACTIVATED=true`
- ✅ Wait 1-2 minutes for dashboard refresh
- ✅ Check PostHog project is selected correctly

### Issue: User not identified after sign in

**Solution**:
- Verify Clerk integration is working
- Check `useAuth()` and `useUser()` hooks return data
- Ensure PostHogProvider is inside ClerkProvider

## Development vs Production

### Development Mode

```bash
# .env.local
NODE_ENV=development
POSTHOG_ACTIVATED=true
NEXT_PUBLIC_POSTHOG_API_KEY=phc_dev_key
```

- Debug mode enabled
- Console logs for all events
- Verbose error messages

### Production Mode

```bash
# .env.production
NODE_ENV=production
POSTHOG_ACTIVATED=true
NEXT_PUBLIC_POSTHOG_API_KEY=phc_prod_key
```

- Debug mode disabled
- No console logs
- Silent error handling
- Consider using separate PostHog project for production

## Testing Analytics

### Manual Testing

```tsx
// In any component
import { useAnalytics } from '@/lib/analytics/hooks/use-analytics';

function TestComponent() {
  const analytics = useAnalytics();

  const handleTest = () => {
    analytics.track('test_event', {
      test: true,
      timestamp: new Date().toISOString(),
    });
  };

  return <button onClick={handleTest}>Test Analytics</button>;
}
```

### Automated Testing

Analytics are automatically tested via:
- Page view tracking on route changes
- CTA click tracking on button interactions
- User identification on authentication

## Next Steps

Once setup is complete:

1. **Review Event Catalog**: See [Events Documentation](./events.md)
2. **Configure Privacy**: See [Privacy Guide](./privacy.md)
3. **Learn Best Practices**: See [Best Practices](./best-practices.md)
4. **Add Custom Events**: Extend tracking for your specific needs

## Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog React SDK](https://posthog.com/docs/libraries/react)
- [PostHog Node.js SDK](https://posthog.com/docs/libraries/node)
- [GDPR Compliance](https://posthog.com/docs/privacy/gdpr-compliance)

## Support

If you encounter issues:

1. Check the [Common Issues](#common-issues--solutions) section
2. Review PostHog's [troubleshooting guide](https://posthog.com/docs/integrate/troubleshooting)
3. Open an issue on GitHub
4. Contact PostHog support (paid plans)
