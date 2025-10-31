/**
 * Email Repository - Data access layer for Resend API
 * Handles all direct interactions with Resend API with retry logic and error handling
 */

import { resend, getDefaultFromAddress } from './client';
import { withRetry } from './utils/retry';
import { logger } from '@/lib/logger';
import type {
  SendEmailInput,
  AddContactInput,
  RemoveContactInput,
  EmailResponse,
  ResendEmailResponse,
  ResendContactResponse,
} from './types';
import {
  EmailServiceError,
  RateLimitError,
  AuthenticationError,
  NetworkError,
} from './errors';

const emailLogger = logger.child({ module: 'email-repository' });

/**
 * Email Repository class
 * Provides abstraction over Resend API with automatic retry and error handling
 */
export class EmailRepository {
  /**
   * Send a single email via Resend API
   * Automatically retries on rate limits and server errors
   *
   * @param params - Email parameters (to, subject, content, etc.)
   * @returns Email response with ID if successful
   *
   * @example
   * const result = await EmailRepository.sendEmail({
   *   to: 'user@example.com',
   *   subject: 'Welcome',
   *   html: '<p>Welcome!</p>'
   * });
   */
  static async sendEmail(
    params: SendEmailInput
  ): Promise<EmailResponse<ResendEmailResponse>> {
    return withRetry(
      async () => {
        try {
          const { data, error } = await resend.emails.send({
            from: params.from || getDefaultFromAddress(),
            to: params.to,
            subject: params.subject,
            react: params.react,
            html: params.html,
            text: params.text,
            reply_to: params.replyTo,
            cc: params.cc,
            bcc: params.bcc,
            tags: params.tags,
            attachments: params.attachments,
          });

          if (error) {
            throw new EmailServiceError(error.message);
          }

          if (!data) {
            throw new EmailServiceError('No data returned from Resend API');
          }

          emailLogger.info(
            {
              emailId: data.id,
              to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
              subject: params.subject,
            },
            'Email sent successfully'
          );

          return { success: true, data };
        } catch (error: any) {
          // Map errors to custom error types for better retry logic
          if (error.statusCode === 429 || error.response?.status === 429) {
            throw new RateLimitError('Rate limit exceeded');
          }

          if (error.statusCode === 401 || error.response?.status === 401) {
            throw new AuthenticationError('Invalid API key');
          }

          if (
            error.statusCode >= 500 ||
            (error.response?.status && error.response.status >= 500)
          ) {
            throw new NetworkError(
              error.message,
              error.statusCode || error.response?.status
            );
          }

          // Re-throw as EmailServiceError for other cases
          if (!(error instanceof EmailServiceError)) {
            throw new EmailServiceError(error.message, error.statusCode);
          }

          throw error;
        }
      },
      'sendEmail'
    );
  }

  /**
   * Add a contact to a Resend audience
   * Used for waitlist, newsletter subscriptions, etc.
   *
   * @param params - Contact parameters (email, name, audience)
   * @returns Contact response with ID if successful
   *
   * @example
   * const result = await EmailRepository.addContact({
   *   email: 'user@example.com',
   *   firstName: 'John',
   *   audienceId: 'aud_123'
   * });
   */
  static async addContact(
    params: AddContactInput
  ): Promise<EmailResponse<ResendContactResponse>> {
    return withRetry(
      async () => {
        try {
          const { data, error } = await resend.contacts.create({
            email: params.email,
            firstName: params.firstName,
            lastName: params.lastName,
            audienceId: params.audienceId,
            unsubscribed: params.unsubscribed,
          });

          if (error) {
            throw new EmailServiceError(error.message);
          }

          if (!data) {
            throw new EmailServiceError('No data returned from Resend API');
          }

          emailLogger.info(
            {
              contactId: data.id,
              email: params.email,
              audienceId: params.audienceId,
            },
            'Contact added successfully'
          );

          return { success: true, data };
        } catch (error: any) {
          if (error.statusCode === 429 || error.response?.status === 429) {
            throw new RateLimitError('Rate limit exceeded');
          }

          if (error.statusCode === 401 || error.response?.status === 401) {
            throw new AuthenticationError('Invalid API key');
          }

          if (
            error.statusCode >= 500 ||
            (error.response?.status && error.response.status >= 500)
          ) {
            throw new NetworkError(
              error.message,
              error.statusCode || error.response?.status
            );
          }

          if (!(error instanceof EmailServiceError)) {
            throw new EmailServiceError(error.message, error.statusCode);
          }

          throw error;
        }
      },
      'addContact'
    );
  }

  /**
   * Check if a contact exists in a Resend audience
   *
   * @param email - Contact's email address
   * @param audienceId - Audience ID to check
   * @returns True if contact exists, false otherwise
   *
   * @example
   * const exists = await EmailRepository.contactExists(
   *   'user@example.com',
   *   'aud_123'
   * );
   */
  static async contactExists(
    email: string,
    audienceId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await resend.contacts.get({
        email,
        audienceId,
      });

      // If no error and data exists, contact is in audience
      if (!error && data) {
        return true;
      }

      // If error is 404, contact doesn't exist
      return false;
    } catch (error: any) {
      // If it's a 404 error, contact doesn't exist
      if (error.statusCode === 404 || error.response?.status === 404) {
        return false;
      }

      // Log other errors but return false to be safe
      emailLogger.warn(
        { email, audienceId, error: error.message },
        'Error checking contact existence'
      );
      return false;
    }
  }

  /**
   * Remove a contact from a Resend audience
   * Used for unsubscribes or user-requested removals
   *
   * @param params - Contact removal parameters (email, audience)
   * @returns Success response
   *
   * @example
   * const result = await EmailRepository.removeContact({
   *   email: 'user@example.com',
   *   audienceId: 'aud_123'
   * });
   */
  static async removeContact(
    params: RemoveContactInput
  ): Promise<EmailResponse> {
    return withRetry(
      async () => {
        try {
          const { data, error } = await resend.contacts.remove({
            email: params.email,
            audienceId: params.audienceId,
          });

          if (error) {
            throw new EmailServiceError(error.message);
          }

          emailLogger.info(
            {
              email: params.email,
              audienceId: params.audienceId,
            },
            'Contact removed successfully'
          );

          return { success: true, data };
        } catch (error: any) {
          if (error.statusCode === 429 || error.response?.status === 429) {
            throw new RateLimitError('Rate limit exceeded');
          }

          if (
            error.statusCode >= 500 ||
            (error.response?.status && error.response.status >= 500)
          ) {
            throw new NetworkError(
              error.message,
              error.statusCode || error.response?.status
            );
          }

          if (!(error instanceof EmailServiceError)) {
            throw new EmailServiceError(error.message, error.statusCode);
          }

          throw error;
        }
      },
      'removeContact'
    );
  }

  /**
   * Send batch emails (up to 100)
   * More efficient than sending individually for multiple recipients
   *
   * @param emails - Array of email parameters
   * @returns Array of email responses
   *
   * @example
   * const results = await EmailRepository.sendBatchEmails([
   *   { to: 'user1@example.com', subject: 'Hi', html: '<p>Hello</p>' },
   *   { to: 'user2@example.com', subject: 'Hi', html: '<p>Hello</p>' }
   * ]);
   */
  static async sendBatchEmails(
    emails: SendEmailInput[]
  ): Promise<EmailResponse<ResendEmailResponse[]>> {
    if (emails.length === 0) {
      return { success: true, data: [] };
    }

    if (emails.length > 100) {
      throw new EmailServiceError('Maximum 100 emails per batch');
    }

    return withRetry(
      async () => {
        try {
          const { data, error } = await resend.batch.send(
            emails.map((email) => ({
              from: email.from || getDefaultFromAddress(),
              to: email.to,
              subject: email.subject,
              react: email.react,
              html: email.html,
              text: email.text,
              reply_to: email.replyTo,
              cc: email.cc,
              bcc: email.bcc,
              tags: email.tags,
              attachments: email.attachments,
            }))
          );

          if (error) {
            throw new EmailServiceError(error.message);
          }

          if (!data) {
            throw new EmailServiceError('No data returned from Resend API');
          }

          emailLogger.info(
            { batchSize: emails.length, emailIds: data.map((d) => d.id) },
            'Batch emails sent successfully'
          );

          return { success: true, data };
        } catch (error: any) {
          if (error.statusCode === 429 || error.response?.status === 429) {
            throw new RateLimitError('Rate limit exceeded');
          }

          if (
            error.statusCode >= 500 ||
            (error.response?.status && error.response.status >= 500)
          ) {
            throw new NetworkError(
              error.message,
              error.statusCode || error.response?.status
            );
          }

          if (!(error instanceof EmailServiceError)) {
            throw new EmailServiceError(error.message, error.statusCode);
          }

          throw error;
        }
      },
      'sendBatchEmails'
    );
  }
}
