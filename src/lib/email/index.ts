/**
 * Email Service Public API
 * Centralized exports for email functionality
 *
 * @example
 * import { EmailService } from '@/lib/email';
 *
 * // Send welcome email
 * await EmailService.sendWelcomeEmail('user@example.com', 'John');
 *
 * // Add to waitlist
 * await EmailService.addToWaitlist('user@example.com', 'Jane');
 */

// Main service (default export)
export { EmailService } from './service';

// Repository (for advanced use cases)
export { EmailRepository } from './repository';

// Client utilities
export { resend, isEmailEnabled, getDefaultFromAddress, getAudienceId } from './client';

// Types
export type {
  SendEmailInput,
  AddContactInput,
  RemoveContactInput,
  EmailResponse,
  RetryConfig,
  WelcomeEmailData,
  WaitlistEmailData,
  ResendEmailResponse,
  ResendContactResponse,
  EmailTag,
} from './types';

// Schemas (for validation in API routes/server actions)
export {
  sendEmailSchema,
  addContactSchema,
  removeContactSchema,
  batchEmailSchema,
} from './schemas';

// Errors (for error handling)
export {
  EmailServiceError,
  RateLimitError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  ConfigurationError,
} from './errors';

// Utility functions
export { withRetry, makeRetryable } from './utils/retry';
