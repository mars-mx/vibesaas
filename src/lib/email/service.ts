/**
 * Email Service - Business logic layer for email operations
 * Provides high-level email functionality with validation and activation checks
 */

import { EmailRepository } from './repository';
import { isEmailEnabled, getAudienceId } from './client';
import { sendEmailSchema, addContactSchema } from './schemas';
import { logger } from '@/lib/logger';
import type { EmailResponse, WelcomeEmailData, WaitlistEmailData } from './types';
import { ValidationError } from './errors';
import { WelcomeEmail, WaitlistEmail } from '@/components/emails';

const emailLogger = logger.child({ module: 'email-service' });

/**
 * Email Service class
 * High-level business logic for email operations
 * Handles activation checks, validation, and orchestrates repository calls
 */
export class EmailService {
  /**
   * Send welcome email after user signup
   * Automatically skipped if RESEND_ACTIVATED=false
   *
   * @param email - User's email address
   * @param firstName - User's first name
   * @returns Email response with success/error/skipped status
   *
   * @example
   * const result = await EmailService.sendWelcomeEmail(
   *   'user@example.com',
   *   'John'
   * );
   *
   * if (result.skipped) {
   *   console.log('Email sending is disabled');
   * }
   */
  static async sendWelcomeEmail(
    email: string,
    firstName: string
  ): Promise<EmailResponse> {
    // Check if email is enabled
    if (!isEmailEnabled()) {
      emailLogger.info(
        { email, operation: 'sendWelcomeEmail' },
        'Email disabled - skipping welcome email'
      );
      return { success: true, skipped: true };
    }

    try {
      // Validate and prepare email data
      const validated = sendEmailSchema.parse({
        to: email,
        subject: `Welcome to ${process.env.RESEND_FROM_NAME}!`,
        react: WelcomeEmail({ firstName, email }),
        tags: [{ name: 'category', value: 'welcome' }],
      });

      // Send email via repository
      return await EmailRepository.sendEmail(validated);
    } catch (error: any) {
      // Handle validation errors
      if (error.name === 'ZodError') {
        emailLogger.error(
          { error: error.message, email },
          'Validation error in sendWelcomeEmail'
        );
        throw new ValidationError(error.message);
      }

      // Log and return error
      emailLogger.error(
        { error: error.message, email, firstName },
        'Failed to send welcome email'
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Send waitlist confirmation email
   * Used after adding user to waitlist audience
   *
   * @param data - Waitlist email data (email, firstName, optional position/referral)
   * @returns Email response with success/error/skipped status
   *
   * @example
   * const result = await EmailService.sendWaitlistEmail({
   *   email: 'user@example.com',
   *   firstName: 'John',
   *   position: 42
   * });
   */
  static async sendWaitlistEmail(
    data: WaitlistEmailData
  ): Promise<EmailResponse> {
    if (!isEmailEnabled()) {
      emailLogger.info(
        { email: data.email, operation: 'sendWaitlistEmail' },
        'Email disabled - skipping waitlist email'
      );
      return { success: true, skipped: true };
    }

    try {
      const validated = sendEmailSchema.parse({
        to: data.email,
        subject: "You're on the waitlist!",
        react: WaitlistEmail(data),
        tags: [{ name: 'category', value: 'waitlist' }],
      });

      return await EmailRepository.sendEmail(validated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        emailLogger.error(
          { error: error.message, email: data.email },
          'Validation error in sendWaitlistEmail'
        );
        throw new ValidationError(error.message);
      }

      emailLogger.error(
        { error: error.message, email: data.email },
        'Failed to send waitlist email'
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Add user to waitlist audience and send confirmation email
   * Combines contact creation and email sending in one operation
   *
   * @param email - User's email address
   * @param firstName - User's first name (optional)
   * @returns Email response with success/error/skipped status
   *
   * @example
   * const result = await EmailService.addToWaitlist(
   *   'user@example.com',
   *   'John'
   * );
   */
  static async addToWaitlist(
    email: string,
    firstName?: string
  ): Promise<EmailResponse> {
    if (!isEmailEnabled()) {
      emailLogger.info(
        { email, operation: 'addToWaitlist' },
        'Email disabled - skipping waitlist'
      );
      return { success: true, skipped: true };
    }

    try {
      // Get audience ID from config
      const audienceId = getAudienceId();

      // Validate and add contact to audience
      const contactData = addContactSchema.parse({
        email,
        firstName,
        audienceId,
        unsubscribed: false,
      });

      const contactResult = await EmailRepository.addContact(contactData);

      // If contact addition failed, return early
      if (!contactResult.success) {
        return contactResult;
      }

      emailLogger.info(
        { email, audienceId, contactId: contactResult.data?.id },
        'Contact added to waitlist audience'
      );

      // Send waitlist confirmation email
      return await this.sendWaitlistEmail({
        email,
        firstName: firstName || 'there',
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        emailLogger.error(
          { error: error.message, email },
          'Validation error in addToWaitlist'
        );
        throw new ValidationError(error.message);
      }

      emailLogger.error(
        { error: error.message, email, firstName },
        'Failed to add to waitlist'
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user is already in waitlist
   *
   * @param email - User's email address
   * @returns True if user is in waitlist, false otherwise
   *
   * @example
   * const inWaitlist = await EmailService.isInWaitlist('user@example.com');
   */
  static async isInWaitlist(email: string): Promise<boolean> {
    if (!isEmailEnabled()) {
      return false;
    }

    try {
      const audienceId = getAudienceId();
      return await EmailRepository.contactExists(email, audienceId);
    } catch (error: any) {
      emailLogger.error(
        { error: error.message, email },
        'Failed to check waitlist status'
      );
      return false;
    }
  }

  /**
   * Remove user from waitlist audience
   * Used for unsubscribes or manual removals
   *
   * @param email - User's email address
   * @returns Success response
   *
   * @example
   * const result = await EmailService.removeFromWaitlist('user@example.com');
   */
  static async removeFromWaitlist(email: string): Promise<EmailResponse> {
    if (!isEmailEnabled()) {
      emailLogger.info(
        { email, operation: 'removeFromWaitlist' },
        'Email disabled - skipping removal'
      );
      return { success: true, skipped: true };
    }

    try {
      const audienceId = getAudienceId();

      return await EmailRepository.removeContact({
        email,
        audienceId,
      });
    } catch (error: any) {
      emailLogger.error(
        { error: error.message, email },
        'Failed to remove from waitlist'
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Generic transactional email sender
   * For custom emails not covered by specific methods
   *
   * @param params - Email parameters
   * @returns Email response with success/error/skipped status
   *
   * @example
   * const result = await EmailService.sendTransactionalEmail({
   *   to: 'user@example.com',
   *   subject: 'Password Reset',
   *   html: '<p>Click link to reset...</p>',
   *   tags: [{ name: 'category', value: 'password-reset' }]
   * });
   */
  static async sendTransactionalEmail(params: {
    to: string | string[];
    subject: string;
    react?: React.ReactElement;
    html?: string;
    text?: string;
    replyTo?: string | string[];
    tags?: Array<{ name: string; value: string }>;
  }): Promise<EmailResponse> {
    if (!isEmailEnabled()) {
      emailLogger.info(
        { to: params.to, operation: 'sendTransactionalEmail' },
        'Email disabled - skipping transactional email'
      );
      return { success: true, skipped: true };
    }

    try {
      const validated = sendEmailSchema.parse(params);
      return await EmailRepository.sendEmail(validated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        emailLogger.error(
          { error: error.message, to: params.to },
          'Validation error in sendTransactionalEmail'
        );
        throw new ValidationError(error.message);
      }

      emailLogger.error(
        { error: error.message, to: params.to },
        'Failed to send transactional email'
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Send batch emails to multiple recipients
   * More efficient than individual sends for bulk operations
   *
   * @param emails - Array of email parameters (max 100)
   * @returns Batch email response
   *
   * @example
   * const result = await EmailService.sendBatchEmails([
   *   { to: 'user1@example.com', subject: 'Hi', html: '<p>Hello</p>' },
   *   { to: 'user2@example.com', subject: 'Hi', html: '<p>Hello</p>' }
   * ]);
   */
  static async sendBatchEmails(
    emails: Array<{
      to: string | string[];
      subject: string;
      react?: React.ReactElement;
      html?: string;
      text?: string;
      tags?: Array<{ name: string; value: string }>;
    }>
  ): Promise<EmailResponse> {
    if (!isEmailEnabled()) {
      emailLogger.info(
        { count: emails.length, operation: 'sendBatchEmails' },
        'Email disabled - skipping batch emails'
      );
      return { success: true, skipped: true };
    }

    try {
      // Validate all emails
      const validatedEmails = emails.map((email) =>
        sendEmailSchema.parse(email)
      );

      return await EmailRepository.sendBatchEmails(validatedEmails);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        emailLogger.error(
          { error: error.message, count: emails.length },
          'Validation error in sendBatchEmails'
        );
        throw new ValidationError(error.message);
      }

      emailLogger.error(
        { error: error.message, count: emails.length },
        'Failed to send batch emails'
      );
      return { success: false, error: error.message };
    }
  }
}
