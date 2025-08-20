# Clerk + Convex + Polar Integration Guide

This guide explains how Clerk (authentication), Convex (backend), and Polar (payments) work together in VibeSaaS using the `@convex-dev/polar` component.

## Architecture Overview

```
User → Clerk (Auth) → Convex (Backend) → Polar (Payments)
         ↓                ↓                    ↓
      User ID         User Data         Subscription
                          ↑                    ↓
                      Automatic Webhooks ←────┘
                    (handled by component)
```

## Key Integration Points

### 1. Identity Flow
- **Clerk** provides user authentication and identity (`clerkId`, `email`, `name`)
- **Convex** stores user data, linking `clerkId` to internal `userId`
- **Polar** uses email as the customer identifier
- The `@convex-dev/polar` component automatically syncs subscription data

### 2. Configuration Setup

#### Required Files

**1. Convex Configuration** (`convex/convex.config.ts`):
```typescript
import { defineApp } from "convex/server";
import polar from "@convex-dev/polar/convex.config";

const app = defineApp();
app.use(polar); // Registers the Polar component
export default app;
```

**2. HTTP Router** (`convex/http.ts`):
```typescript
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// The Polar component automatically registers webhook routes at /polar/events
// No manual webhook handling needed!

export default http;
```

#### Clerk JWT Template
Create a JWT template named **"convex"** in Clerk Dashboard with:
- `"aud": "convex"` claim (required)
- User email and name claims
- Copy the Issuer URL for Convex configuration

#### Environment Variables
```bash
# Clerk (in .env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# For Next.js specifically:
CLERK_JWT_ISSUER_DOMAIN=https://xxx.clerk.accounts.dev
# Or for production:
# CLERK_JWT_ISSUER_DOMAIN=https://clerk.yourdomain.com

# Convex (in .env.local)
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud

# Polar (via Convex environment - NOT in .env.local)
npx convex env set POLAR_ORGANIZATION_TOKEN xxx
```

#### Provider Setup
Use `ConvexProviderWithClerk` to wrap your app, passing Clerk's `useAuth` hook to enable authentication.

### 3. User-Subscription Linking

The `@convex-dev/polar` component handles the integration automatically:
1. User authenticates via Clerk
2. Convex creates/updates user record with `clerkId`
3. When user subscribes, component creates customer in Polar with their email
4. Component automatically syncs subscription data via webhooks
5. Subscription status is stored in Convex and linked to user

**Important**: The component requires a `getUserInfo` function to map users:
```typescript
// convex/polar.ts
import { polar } from "@convex-dev/polar/convex";

// Define how to get user info for Polar
polar.getUserInfo = async (ctx, userId) => {
  const user = await ctx.db.get(userId);
  return {
    email: user?.email ?? "",
    name: user?.name,
    metadata: {
      clerkId: user?.clerkId, // Store for reverse lookups
    },
  };
};

export default polar;
```

### 4. Subscription Management

#### Automatic Webhook Handling
The `@convex-dev/polar` component automatically handles these webhook events:
- `subscription.created` - New subscription created
- `subscription.updated` - Subscription modified (including cancellations)
- `subscription.active` - Subscription activated
- `subscription.canceled` - Subscription cancelled
- `subscription.uncanceled` - Subscription reactivated
- `subscription.revoked` - Subscription revoked
- `order.created` - Renewal orders (billing_reason: subscription_cycle)
- `customer.created` - New customer created
- `customer.updated` - Customer information updated

**No manual webhook implementation needed** - the component handles everything internally!

#### Checkout Flow
Use the component's built-in functions:
```typescript
// Generate checkout URL
const checkoutUrl = await ctx.runAction(api.polar.generateCheckoutLink, {
  productId: "prod_xxxxx",
  userId: user._id,
  successUrl: "https://app.com/success",
  metadata: { // Optional custom metadata
    source: "pricing-page"
  }
});
```

#### Customer Portal
Generate portal URLs for subscription management:
```typescript
// Generate customer portal URL
const portalUrl = await ctx.runAction(api.polar.generateCustomerPortalUrl, {
  userId: user._id
});
```

**Note**: Customers authenticate via email when accessing the portal. The portal URL format is `https://polar.sh/your-org-slug/portal`.

#### Product Synchronization
Sync your Polar products to Convex:
```typescript
// One-time sync of all products from Polar
await ctx.runAction(api.polar.syncProducts);
```

### 5. Available Component Functions

The `@convex-dev/polar` component provides these pre-built functions:

#### Queries
```typescript
// Get user's current subscription
const subscription = await ctx.runQuery(api.polar.getCurrentSubscription, {
  userId: user._id
});

// List all products
const products = await ctx.runQuery(api.polar.listProducts);

// Get specific product
const product = await ctx.runQuery(api.polar.getProduct, {
  productId: "prod_xxxxx"
});
```

#### Actions
```typescript
// Generate checkout link
const checkoutUrl = await ctx.runAction(api.polar.generateCheckoutLink, {
  productId: "prod_xxxxx",
  userId: user._id,
  successUrl: "https://app.com/success",
  metadata: { source: "upgrade-button" }
});

// Change subscription
await ctx.runAction(api.polar.changeCurrentSubscription, {
  userId: user._id,
  productId: "prod_new_plan"
});

// Cancel subscription
await ctx.runAction(api.polar.cancelCurrentSubscription, {
  userId: user._id
});

// Generate customer portal URL
const portalUrl = await ctx.runAction(api.polar.generateCustomerPortalUrl, {
  userId: user._id
});

// Sync products from Polar
await ctx.runAction(api.polar.syncProducts);
```

## Data Flow Examples

### New User Signup
1. User signs up via Clerk
2. Clerk webhook or client creates user in Convex with `clerkId`
3. User record created with no subscription (free tier)
4. Component queries return null subscription

### Subscription Purchase
1. User clicks checkout button
2. Frontend calls `generateCheckoutLink` action
3. User redirected to Polar checkout
4. User completes payment on Polar
5. Polar sends webhook to `/polar/events`
6. Component automatically updates subscription in Convex
7. UI reactively updates via Convex real-time sync

### Subscription Management
1. User requests portal access
2. Frontend calls `generateCustomerPortalUrl` action
3. User redirected to Polar portal
4. User authenticates via email in Polar
5. User manages subscription (upgrade/downgrade/cancel)
6. Changes trigger webhooks automatically
7. Component updates Convex data instantly

## Best Practices

### Security
- **Token Management**: Polar tokens must ONLY be set via Convex environment variables, never in client-side code
- **API Calls**: All Polar operations go through Convex actions/mutations
- **Webhook Security**: The component validates webhook signatures automatically
- **Data Protection**: Store only necessary customer data, no payment details

### Data Consistency
- **Single Source of Truth**: The component maintains subscription state automatically via webhooks
- **Idempotency**: Component handles webhook idempotency internally
- **Real-time Updates**: Convex reactivity ensures instant UI updates
- **Error Recovery**: Component includes retry logic for failed operations

### User Experience
- **Loading States**: Show spinners during checkout/portal URL generation
- **Error Handling**: Gracefully handle subscription failures
- **Status Display**: Use real-time subscription status from Convex queries
- **Clear CTAs**: Provide obvious upgrade/manage subscription buttons

## Common Implementation Patterns

### 1. Subscription Gate Component
```typescript
// components/SubscriptionGate.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function SubscriptionGate({ children, requiredProduct }) {
  const subscription = useQuery(api.polar.getCurrentSubscription, {
    userId: currentUser._id
  });
  
  if (!subscription || subscription.productId !== requiredProduct) {
    return <UpgradePrompt productId={requiredProduct} />;
  }
  
  return children;
}
```

### 2. Checkout Button
```typescript
// components/CheckoutButton.tsx
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function CheckoutButton({ productId }) {
  const generateCheckout = useAction(api.polar.generateCheckoutLink);
  
  const handleCheckout = async () => {
    const url = await generateCheckout({
      productId,
      userId: currentUser._id,
      successUrl: `${window.location.origin}/success`
    });
    window.location.href = url;
  };
  
  return <button onClick={handleCheckout}>Subscribe</button>;
}
```

### 3. Subscription Management
```typescript
// components/ManageSubscription.tsx
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ManageSubscription() {
  const subscription = useQuery(api.polar.getCurrentSubscription, {
    userId: currentUser._id
  });
  const generatePortal = useAction(api.polar.generateCustomerPortalUrl);
  
  const openPortal = async () => {
    const url = await generatePortal({ userId: currentUser._id });
    window.location.href = url;
  };
  
  if (!subscription) return null;
  
  return (
    <div>
      <p>Current Plan: {subscription.product.name}</p>
      <button onClick={openPortal}>Manage Subscription</button>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

**"No Auth Provider Found"**
- Verify Clerk JWT template is named "convex" with `"aud": "convex"` claim
- Check `CLERK_JWT_ISSUER_DOMAIN` is set correctly in Convex dashboard

**Webhooks not working**
- Confirm `convex.config.ts` includes `app.use(polar)`
- Check webhook URL format: `https://your-project.convex.site/polar/events`
- Verify `POLAR_ORGANIZATION_TOKEN` is set in Convex environment

**Subscription not found**
- Ensure `getUserInfo` function is implemented in `convex/polar.ts`
- Verify email matches between Clerk user and Polar customer
- Check if products are synced with `syncProducts` action

**Portal URL generation fails**
- User must have an active customer record in Polar
- Verify user has made at least one purchase
- Check Polar organization settings for portal configuration

## Architecture Notes

### Why This Architecture?

1. **Separation of Concerns**: Each service handles its domain - Clerk (auth), Convex (data), Polar (payments)
2. **Automatic Synchronization**: The `@convex-dev/polar` component eliminates manual webhook handling
3. **Type Safety**: Full TypeScript support across all integrations
4. **Real-time Updates**: Convex's reactivity ensures instant UI updates without polling
5. **Security by Default**: Tokens never exposed to clients, all operations server-side

### Scaling Considerations

- **Webhook Processing**: Component handles webhook queuing and retries automatically
- **Subscription Queries**: Cached in Convex for fast access, synced via webhooks
- **Customer Data**: Minimal storage in Convex, Polar remains source of truth for billing
- **Multi-tenancy**: Each user's subscription is isolated and independently managed

## References

- [Clerk + Convex Integration](https://docs.convex.dev/auth/clerk)
- [Convex-Polar Component Docs](https://www.convex.dev/components/polar)
- [Polar API Documentation](https://docs.polar.sh)
- [Convex Components Overview](https://docs.convex.dev/components)
- [Example Implementation](https://github.com/get-convex/convex-polar-example)