# Authentication Setup Guide

Follow these steps to complete the Clerk authentication setup for VibeSaaS.

## 1. Create Clerk Account

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your authentication options (email/password, OAuth providers, etc.)

## 2. Get Clerk API Keys

From your Clerk dashboard:
1. Go to API Keys section
2. Copy the Publishable Key and Secret Key

## 3. Set Environment Variables

Create `.env.local` with:

```bash
# Convex (Backend)
CONVEX_DEPLOYMENT=your-convex-deployment-url
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Polar (Payment provider)
POLAR_ACCESS_TOKEN=polar_...
POLAR_SUCCESS_URL=http://localhost:3000/success?checkout_id={CHECKOUT_ID}

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Configure Clerk Settings

In your Clerk dashboard:

### Paths Settings:
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in: `/dashboard`
- After sign-up: `/dashboard`

### JWT Templates:
1. Create a new JWT template named "convex"
2. Set the template to:
```json
{
  "sub": "{{user.id}}",
  "iss": "https://your-clerk-domain.clerk.accounts.dev",
  "aud": "convex",
  "exp": {{date.unix_timestamp}}
}
```

### Webhooks:
1. Add webhook endpoint: `http://localhost:3000/api/webhooks/clerk`
2. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
3. Copy the signing secret to `CLERK_WEBHOOK_SIGNING_SECRET`

## 5. Set up Convex

1. Run `npx convex dev` to start Convex development server
2. Follow the prompts to create/configure your Convex project
3. Set Convex environment variables:
   - `CLERK_JWT_ISSUER_DOMAIN` = your Clerk issuer domain
   - `POLAR_ORGANIZATION_TOKEN` = your Polar organization token

## 6. Set up Polar Integration

1. Configure Polar organization token in Convex:
   ```bash
   npx convex env set POLAR_ORGANIZATION_TOKEN polar_...
   ```

2. In Polar dashboard, set webhook URL:
   `https://your-convex-deployment.convex.cloud/polar/webhook`

## 7. Test the Setup

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Test sign up and sign in flows
4. Verify dashboard access
5. Check webhook synchronization

## Common Issues

### 1. Webhook Verification Failed
- Ensure `CLERK_WEBHOOK_SIGNING_SECRET` is set correctly
- Use ngrok for local webhook testing

### 2. JWT Template Issues
- Verify the JWT template is named "convex"
- Check the issuer domain matches your Clerk domain

### 3. Convex Connection Issues
- Ensure `NEXT_PUBLIC_CONVEX_URL` is accessible
- Verify Convex deployment is active

### 4. Redirect Loops
- Check middleware configuration
- Verify protected routes are configured correctly