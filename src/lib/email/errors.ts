/**
 * Custom error classes for email service
 * Provides specific error types for better error handling and retry logic
 */

/**
 * Base error class for all email service errors
 */
export class EmailServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'EmailServiceError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmailServiceError);
    }
  }
}

/**
 * Rate limit exceeded error (HTTP 429)
 * Should trigger retry with exponential backoff
 */
export class RateLimitError extends EmailServiceError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Validation error for invalid input (HTTP 400)
 * Should NOT be retried
 */
export class ValidationError extends EmailServiceError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error for invalid API key (HTTP 401)
 * Should NOT be retried
 */
export class AuthenticationError extends EmailServiceError {
  constructor(message: string = 'Invalid API key') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Network error for server-side issues (HTTP 500, 502, 503, 504)
 * Should trigger retry with exponential backoff
 */
export class NetworkError extends EmailServiceError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = 'NetworkError';
  }
}

/**
 * Configuration error for missing environment variables
 * Should NOT be retried
 */
export class ConfigurationError extends EmailServiceError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
