/**
 * Resend client singleton for Next.js serverless/edge environments
 * Uses globalThis pattern to ensure single instance across all imports and hot reloads
 */

import { Resend } from 'resend';
import { ConfigurationError } from './errors';

/**
 * Global type augmentation for Resend client
 * Ensures type safety when accessing globalThis.__resend
 */
const globalForResend = globalThis as typeof globalThis & {
  __resend?: Resend;
};

/**
 * Initialize Resend client singleton using globalThis pattern
 * This approach:
 * - Survives webpack bundling and creates single instance
 * - Works with Next.js serverless cold starts
 * - Prevents multiple client instantiations
 * - Compatible with development hot reloading
 */
if (!globalForResend.__resend) {
  if (!process.env.RESEND_API_KEY) {
    throw new ConfigurationError(
      'RESEND_API_KEY environment variable is not set. Please add it to your .env.local file.'
    );
  }

  globalForResend.__resend = new Resend(process.env.RESEND_API_KEY);
}

/**
 * Singleton Resend client instance
 * Use this for all Resend API operations
 *
 * @example
 * import { resend } from '@/lib/email/client';
 *
 * await resend.emails.send({
 *   from: 'noreply@example.com',
 *   to: 'user@example.com',
 *   subject: 'Hello',
 *   html: '<p>World</p>'
 * });
 */
export const resend = globalForResend.__resend;

/**
 * Check if email sending is enabled via RESEND_ACTIVATED flag
 * When disabled, email operations will be skipped gracefully
 *
 * @returns true if RESEND_ACTIVATED=true, false otherwise
 *
 * @example
 * if (!isEmailEnabled()) {
 *   console.log('Email disabled - skipping send');
 *   return { success: true, skipped: true };
 * }
 */
export const isEmailEnabled = (): boolean => {
  return process.env.RESEND_ACTIVATED === 'true';
};

/**
 * Get default from address for emails
 * Combines RESEND_FROM_NAME and RESEND_FROM_EMAIL
 *
 * @returns Formatted email address "Name <email@example.com>"
 *
 * @example
 * const from = getDefaultFromAddress(); // "VibeSaaS <noreply@vibesaas.com>"
 */
export const getDefaultFromAddress = (): string => {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME;

  if (!fromEmail) {
    throw new ConfigurationError(
      'RESEND_FROM_EMAIL environment variable is not set'
    );
  }

  if (!fromName) {
    return fromEmail;
  }

  return `${fromName} <${fromEmail}>`;
};

/**
 * Get configured audience ID for waitlist/newsletter
 *
 * @returns Audience ID from environment variable
 * @throws ConfigurationError if not set
 *
 * @example
 * const audienceId = getAudienceId();
 */
export const getAudienceId = (): string => {
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!audienceId) {
    throw new ConfigurationError(
      'RESEND_AUDIENCE_ID environment variable is not set'
    );
  }

  return audienceId;
};
