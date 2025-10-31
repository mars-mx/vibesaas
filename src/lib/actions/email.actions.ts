/**
 * Email-related server actions
 * Server actions for email operations triggered from client components
 */

'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { EmailService } from '@/lib/email';
import { logger } from '@/lib/logger';

const emailActionsLogger = logger.child({ module: 'email-actions' });

/**
 * Check if current user is in waitlist
 *
 * @returns Boolean indicating if user is in waitlist
 */
export async function checkWaitlistStatusAction() {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return { inWaitlist: false };
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { inWaitlist: false };
    }

    const inWaitlist = await EmailService.isInWaitlist(email);
    return { inWaitlist };
  } catch (error: any) {
    emailActionsLogger.error(
      { error: error.message },
      'Unexpected error in checkWaitlistStatusAction'
    );
    return { inWaitlist: false };
  }
}

/**
 * Remove current user from waitlist
 *
 * @returns Response with success status and optional error message
 */
export async function removeFromWaitlistAction() {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      emailActionsLogger.warn('Attempted waitlist removal without authentication');
      return {
        success: false,
        error: 'You must be logged in to leave the waitlist',
      };
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      emailActionsLogger.error({ userId }, 'User has no email address');
      return {
        success: false,
        error: 'No email address found for your account',
      };
    }

    emailActionsLogger.info({ userId, email }, 'Removing user from waitlist');

    // Remove from waitlist via email service
    const result = await EmailService.removeFromWaitlist(email);

    if (result.skipped) {
      emailActionsLogger.info({ userId, email }, 'Waitlist removal skipped (RESEND_ACTIVATED=false)');
      return {
        success: true,
        skipped: true,
        message: 'You have been removed from the waitlist',
      };
    }

    if (!result.success) {
      emailActionsLogger.error(
        { userId, email, error: result.error },
        'Failed to remove user from waitlist'
      );
      return {
        success: false,
        error: result.error || 'Failed to remove you from the waitlist. Please try again.',
      };
    }

    emailActionsLogger.info(
      { userId, email },
      'User successfully removed from waitlist'
    );

    return {
      success: true,
      message: 'You have been removed from the waitlist.',
    };
  } catch (error: any) {
    emailActionsLogger.error(
      { error: error.message },
      'Unexpected error in removeFromWaitlistAction'
    );

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}

/**
 * Add current user to waitlist
 * Sends waitlist confirmation email and adds to Resend audience
 *
 * @returns Response with success status and optional error message
 */
export async function addToWaitlistAction() {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      emailActionsLogger.warn('Attempted waitlist signup without authentication');
      return {
        success: false,
        error: 'You must be logged in to join the waitlist',
      };
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;
    const firstName = user.firstName || '';

    if (!email) {
      emailActionsLogger.error({ userId }, 'User has no email address');
      return {
        success: false,
        error: 'No email address found for your account',
      };
    }

    emailActionsLogger.info({ userId, email }, 'Adding user to waitlist');

    // Add to waitlist via email service
    const result = await EmailService.addToWaitlist(email, firstName);

    if (result.skipped) {
      emailActionsLogger.info({ userId, email }, 'Waitlist email skipped (RESEND_ACTIVATED=false)');
      return {
        success: true,
        skipped: true,
        message: 'You have been added to the waitlist (email sending is currently disabled)',
      };
    }

    if (!result.success) {
      emailActionsLogger.error(
        { userId, email, error: result.error },
        'Failed to add user to waitlist'
      );
      return {
        success: false,
        error: result.error || 'Failed to add you to the waitlist. Please try again.',
      };
    }

    emailActionsLogger.info(
      { userId, email, emailId: result.data?.id },
      'User successfully added to waitlist'
    );

    return {
      success: true,
      message: 'Welcome to the waitlist! Check your email for confirmation.',
    };
  } catch (error: any) {
    emailActionsLogger.error(
      { error: error.message },
      'Unexpected error in addToWaitlistAction'
    );

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
