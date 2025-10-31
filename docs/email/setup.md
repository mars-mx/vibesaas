# Email Setup with Resend

This guide covers the complete setup process for Resend email integration in VibeSaaS.

## Overview

Resend is a developer-first email API that enables you to send transactional and marketing emails from your Next.js application. This project uses Resend for:

- Transactional emails (password resets, confirmations)
- Post-signup waitlist flows
- User notifications
- Marketing campaigns

## Prerequisites

- [Resend account](https://resend.com/signup)
- Verified domain (for production)
- Node.js and npm installed

## Installation

Resend is already installed in this project:

```bash
npm install resend
```

Current version: **6.3.0**

## Configuration

### 1. Create API Key

1. Go to the [Resend API Keys Dashboard](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name your key (e.g., `vibesaas-production` or `vibesaas-development`)
4. Select permission level:
   - **Full access**: Complete resource management (use for development)
   - **Sending access**: Only send emails (recommended for production)
5. Optionally restrict domain access for additional security
6. **Copy the API key immediately** (you can only view it once)

### 2. Environment Variables

Add your Resend API key to `.env.local`:

```bash
# Resend Email Configuration
RESEND_ACTIVATED=true  # Set to false to disable email sending
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email From Address (use your verified domain)
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=YourApp
```

**Security Best Practices:**
- Never commit `.env.local` to version control
- Use different API keys for development and production
- Use "Sending access" keys in production to limit permissions
- Rotate keys that haven't been used in 30 days
- Delete unused keys to minimize security risks

### 3. Domain Verification (Production)

For production use, you must verify your domain to improve deliverability and remove the "via resend.dev" label.

1. Go to [Resend Domains Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the provided DNS records to your domain registrar:
   - **SPF** record (TXT)
   - **DKIM** record (TXT)
   - **DMARC** record (TXT - optional but recommended)
5. Wait for DNS propagation (up to 72 hours, usually faster)
6. Verify domain status in dashboard

**Development Note:** For development, you can use `onboarding@resend.dev` as the from address without domain verification.

## Integration with Next.js App Router

### Basic Setup

Create a Resend client instance:

```typescript
// src/lib/email/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to check if email is enabled
export const isEmailEnabled = () => {
  return process.env.RESEND_ACTIVATED === 'true';
};
```

### Email Templates with React

Create reusable email templates as React components:

```tsx
// src/components/emails/WelcomeEmail.tsx
import * as React from 'react';

interface WelcomeEmailProps {
  firstName: string;
  email: string;
}

export function WelcomeEmail({ firstName, email }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome to VibeSaaS, {firstName}!</h1>
      <p>Thanks for signing up with {email}</p>
      <p>We're excited to have you on board.</p>
    </div>
  );
}
```

### Sending Emails - API Route (App Router)

Create an API route for sending emails:

```typescript
// src/app/api/email/send/route.ts
import { resend } from '@/lib/email/resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Welcome to VibeSaaS!',
      react: WelcomeEmail({ firstName, email }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

### Sending Emails - Server Actions

For direct server-side operations:

```typescript
// src/lib/actions/email.actions.ts
'use server';

import { resend } from '@/lib/email/resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

export async function sendWelcomeEmail(email: string, firstName: string) {
  // Check if email is enabled
  if (process.env.RESEND_ACTIVATED !== 'true') {
    return { success: true, skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Welcome to VibeSaaS!',
      react: WelcomeEmail({ firstName, email }),
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
```

## Integration with Clerk Authentication

### Post-Signup Webhook

To send emails after user signup, use Clerk webhooks:

```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { sendWelcomeEmail } from '@/lib/actions/email.actions';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification error', { status: 400 });
  }

  // Handle user.created event
  if (evt.type === 'user.created') {
    const { email_addresses, first_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      await sendWelcomeEmail(email, first_name || 'there');
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
```

## Email Template Best Practices

### 1. Use React Email Components

For more sophisticated templates, consider using the [React Email](https://react.email/) library:

```bash
npm install @react-email/components
```

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export function WelcomeEmail({ firstName }: { firstName: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to VibeSaaS!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://yourdomain.com/logo.png"
            width="170"
            height="50"
            alt="VibeSaaS"
            style={logo}
          />
          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
            Welcome to VibeSaaS! We're excited to have you on board.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://yourdomain.com/dashboard">
              Get Started
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#000',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};
```

### 2. Email Development Workflow

Preview emails locally during development:

```bash
npm install react-email -D
```

Add to `package.json`:

```json
{
  "scripts": {
    "email:dev": "email dev"
  }
}
```

Run the preview server:

```bash
npm run email:dev
```

### 3. Testing Emails

Test email sending in development:

```typescript
// Test in development mode
if (process.env.NODE_ENV === 'development') {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev', // Use Resend's test domain
    to: ['your-test-email@example.com'],
    subject: 'Test Email',
    react: TestEmail(),
  });
}
```

## Audience Management (Waitlist)

### Creating an Audience

1. Go to [Resend Audiences Dashboard](https://resend.com/audiences)
2. Click **"Create Audience"**
3. Name it (e.g., "Waitlist", "Newsletter", "Product Updates")
4. Use the Audience API to add contacts

### Adding Contacts to Audience

```typescript
// src/lib/email/audience.ts
import { resend } from './resend';

export async function addToWaitlist(email: string, firstName: string) {
  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    if (error) {
      console.error('Failed to add to waitlist:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to add to waitlist:', error);
    return { success: false, error };
  }
}
```

Add to `.env.local`:

```bash
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Monitoring and Analytics

### Email Dashboard

Track email performance in the [Resend Dashboard](https://resend.com/emails):
- Delivery status
- Open rates
- Click rates
- Bounce rates

### Webhooks for Email Events

Set up webhooks to track email events in your application:

1. Go to [Resend Webhooks Dashboard](https://resend.com/webhooks)
2. Create a new webhook endpoint
3. Select events to track:
   - `email.sent`
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
4. Add your webhook URL (e.g., `https://yourdomain.com/api/webhooks/resend`)

```typescript
// src/app/api/webhooks/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature
    const signature = request.headers.get('svix-signature');
    // Add signature verification logic

    // Handle different event types
    switch (body.type) {
      case 'email.delivered':
        console.log('Email delivered:', body.data);
        break;
      case 'email.opened':
        console.log('Email opened:', body.data);
        break;
      case 'email.clicked':
        console.log('Link clicked:', body.data);
        break;
      case 'email.bounced':
        console.log('Email bounced:', body.data);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}
```

## Troubleshooting

### Common Issues

**API Key Not Found**
- Ensure `.env.local` exists and contains `RESEND_API_KEY`
- Restart your development server after adding environment variables

**Domain Not Verified**
- Use `onboarding@resend.dev` for development
- Add DNS records for your custom domain
- Wait for DNS propagation (up to 72 hours)

**Emails Not Sending**
- Check API key permissions (use "Sending access" or "Full access")
- Verify the "from" email address matches your verified domain
- Check Resend dashboard for error logs

**Rate Limits**
- Free tier: 100 emails/day, 3,000 emails/month
- Paid plans: Higher limits based on your subscription

### Getting Help

- [Resend Documentation](https://resend.com/docs)
- [Resend Discord Community](https://resend.com/discord)
- [Resend Support](https://resend.com/support)

## Next Steps

1. ✅ Install Resend (`npm install resend`)
2. ✅ Create API key and add to `.env.local`
3. ✅ Verify domain (production)
4. 🔄 Create email templates (see [Email Templates](./templates.md))
5. 🔄 Set up post-signup flow (see [Waitlist Flow](./waitlist-flow.md))
6. 🔄 Configure webhooks for tracking
7. 🔄 Test email delivery

## Related Documentation

- [Email Templates Guide](./templates.md)
- [Waitlist Flow Implementation](./waitlist-flow.md)
- [Integration with Clerk](../backend/integration.md)
