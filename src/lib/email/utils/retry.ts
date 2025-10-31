/**
 * Retry logic with exponential backoff and jitter
 * Handles transient failures gracefully with configurable retry strategy
 */

import { logger } from '@/lib/logger';
import type { RetryConfig } from '../types';

/**
 * Default retry configuration
 * - 3 retries maximum
 * - 1 second base delay
 * - 10 seconds maximum delay
 * - Retry on rate limit and server errors
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryableStatusCodes: [429, 500, 502, 503, 504],
};

/**
 * Calculate delay with exponential backoff and jitter
 * Jitter prevents thundering herd problem when multiple clients retry simultaneously
 *
 * @param baseDelay - Base delay in milliseconds
 * @param attempt - Current attempt number (0-indexed)
 * @param maxDelay - Maximum delay cap
 * @returns Delay in milliseconds with exponential growth and random jitter
 *
 * @example
 * calculateDelayWithJitter(1000, 0, 10000) // ~1000-1300ms
 * calculateDelayWithJitter(1000, 1, 10000) // ~2000-2600ms
 * calculateDelayWithJitter(1000, 2, 10000) // ~4000-5200ms
 */
function calculateDelayWithJitter(
  baseDelay: number,
  attempt: number,
  maxDelay: number
): number {
  // Exponential backoff: delay * 2^attempt
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

  // Add 30% random jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * exponentialDelay;

  return Math.floor(exponentialDelay + jitter);
}

/**
 * Determine if an error should trigger a retry
 *
 * @param error - Error object to check
 * @param retryableStatusCodes - List of HTTP status codes that are retryable
 * @returns true if error should be retried, false otherwise
 */
function isRetryableError(
  error: any,
  retryableStatusCodes: number[]
): boolean {
  // Check for statusCode on error object
  if (error.statusCode && retryableStatusCodes.includes(error.statusCode)) {
    return true;
  }

  // Check for status in response object (Axios-style)
  if (
    error.response?.status &&
    retryableStatusCodes.includes(error.response.status)
  ) {
    return true;
  }

  // Network errors that should be retried
  if (
    error.code === 'ECONNRESET' ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ECONNREFUSED'
  ) {
    return true;
  }

  return false;
}

/**
 * Retry an async operation with exponential backoff
 * Automatically retries on transient errors (rate limits, server errors)
 * Does not retry on client errors (validation, authentication)
 *
 * @param operation - Async function to retry
 * @param context - Context string for logging (e.g., "sendEmail", "addContact")
 * @param config - Optional retry configuration
 * @returns Promise resolving to operation result
 * @throws Last error if all retries fail
 *
 * @example
 * const result = await withRetry(
 *   () => resend.emails.send({ ... }),
 *   'sendEmail',
 *   { maxRetries: 5 }
 * );
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  context: string,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, retryableStatusCodes } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Attempt the operation
      return await operation();
    } catch (error: any) {
      lastError = error;

      const isRetryable = isRetryableError(error, retryableStatusCodes);
      const isLastAttempt = attempt === maxRetries;

      // If not retryable or last attempt, throw immediately
      if (!isRetryable || isLastAttempt) {
        logger.error(
          {
            context,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            error: error.message,
            statusCode: error.statusCode || error.response?.status,
            retryable: isRetryable,
          },
          'Operation failed'
        );
        throw error;
      }

      // Calculate delay for next retry
      const delay = calculateDelayWithJitter(baseDelay, attempt, maxDelay);

      logger.warn(
        {
          context,
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
          nextRetryIn: `${delay}ms`,
          statusCode: error.statusCode || error.response?.status,
          error: error.message,
        },
        'Retrying operation after error'
      );

      // Wait before next retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError!;
}

/**
 * Create a retryable version of a function
 * Useful for wrapping repository methods
 *
 * @param fn - Function to make retryable
 * @param context - Context string for logging
 * @param config - Optional retry configuration
 * @returns Wrapped function with retry logic
 *
 * @example
 * const sendEmailWithRetry = makeRetryable(
 *   (params) => resend.emails.send(params),
 *   'sendEmail'
 * );
 */
export function makeRetryable<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  context: string,
  config?: Partial<RetryConfig>
) {
  return async (...args: TArgs): Promise<TReturn> => {
    return withRetry(() => fn(...args), context, config);
  };
}
