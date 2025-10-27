import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { fetchAction } from 'convex/nextjs';
import { api } from '../../../../../convex/_generated/api';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const log = logger.child({ module: 'clerk-webhook' });
  
  // Verify webhook headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    log.warn('Missing svix headers in webhook request');
    return new Response('Missing svix headers', { status: 400 });
  }

  // Verify webhook secret is configured
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!webhookSecret) {
    log.error('CLERK_WEBHOOK_SIGNING_SECRET not configured');
    return new Response('Server configuration error', { status: 500 });
  }

  // Verify webhook signature
  let evt: WebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    evt = wh.verify(await req.text(), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    log.error({ error: err }, 'Webhook signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }

  const eventType = evt.type;
  const eventData = evt.data as any;

  // Extract user ID based on event type
  const clerkId = eventType === 'session.created' 
    ? eventData.user_id 
    : eventData.id;

  if (!clerkId) {
    log.error({ eventType }, 'Missing user ID in webhook event');
    return new Response('Missing user ID', { status: 400 });
  }
  
  log.info({ eventType, clerkId }, 'Processing Clerk webhook event');

  try {
    // Call Convex to handle the webhook
    await fetchAction(api.users.handleClerkWebhook as any, {
      eventType,
      clerkId,
    });

    log.info({ eventType, clerkId }, 'Webhook processed successfully');
    return new Response('Success', { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      { 
        eventType, 
        clerkId, 
        error: errorMessage 
      }, 
      'Webhook processing failed'
    );
    
    // Return 400 for user errors, 500 for server errors
    const isUserError = errorMessage.includes('User not found') || 
                        errorMessage.includes('Invalid');
    return new Response('Processing failed', { 
      status: isUserError ? 400 : 500 
    });
  }
}