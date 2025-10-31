/**
 * TypeScript types and interfaces for email service
 */

import type { z } from 'zod';
import type { sendEmailSchema, addContactSchema, removeContactSchema } from './schemas';

/**
 * Inferred types from Zod schemas
 */
export type SendEmailInput = z.infer<typeof sendEmailSchema>;
export type AddContactInput = z.infer<typeof addContactSchema>;
export type RemoveContactInput = z.infer<typeof removeContactSchema>;

/**
 * Standard response format for all email operations
 */
export interface EmailResponse<T = unknown> {
  /** Whether the operation succeeded */
  success: boolean;

  /** Response data if successful */
  data?: T;

  /** Error message if failed */
  error?: string;

  /** Whether the operation was skipped (e.g., when RESEND_ACTIVATED=false) */
  skipped?: boolean;
}

/**
 * Configuration for retry logic with exponential backoff
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;

  /** Base delay in milliseconds for first retry */
  baseDelay: number;

  /** Maximum delay in milliseconds (caps exponential growth) */
  maxDelay: number;

  /** HTTP status codes that should trigger a retry */
  retryableStatusCodes: number[];
}

/**
 * Email template data for welcome emails
 */
export interface WelcomeEmailData {
  firstName: string;
  email: string;
}

/**
 * Email template data for waitlist emails
 */
export interface WaitlistEmailData {
  firstName: string;
  email: string;
  position?: number;
  referralUrl?: string;
}

/**
 * Resend API email send response
 */
export interface ResendEmailResponse {
  id: string;
}

/**
 * Resend API contact response
 */
export interface ResendContactResponse {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

/**
 * Tag for categorizing emails
 */
export interface EmailTag {
  name: string;
  value: string;
}
