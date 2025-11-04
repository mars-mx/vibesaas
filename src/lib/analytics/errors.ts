/**
 * Analytics Error Classes
 *
 * Custom error types for analytics operations.
 */

/**
 * Base analytics error
 */
export class AnalyticsError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AnalyticsError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AnalyticsError);
    }
  }
}

/**
 * Error thrown when analytics is not initialized
 */
export class AnalyticsNotInitializedError extends AnalyticsError {
  constructor(message = 'Analytics is not initialized') {
    super(message, 'ANALYTICS_NOT_INITIALIZED');
    this.name = 'AnalyticsNotInitializedError';
  }
}

/**
 * Error thrown when analytics is disabled
 */
export class AnalyticsDisabledError extends AnalyticsError {
  constructor(message = 'Analytics is disabled via POSTHOG_ACTIVATED flag') {
    super(message, 'ANALYTICS_DISABLED');
    this.name = 'AnalyticsDisabledError';
  }
}

/**
 * Error thrown when tracking fails
 */
export class AnalyticsTrackingError extends AnalyticsError {
  constructor(
    message: string,
    public readonly eventName: string,
    originalError?: Error
  ) {
    super(message, 'ANALYTICS_TRACKING_ERROR', originalError);
    this.name = 'AnalyticsTrackingError';
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class AnalyticsConfigError extends AnalyticsError {
  constructor(message: string, originalError?: Error) {
    super(message, 'ANALYTICS_CONFIG_ERROR', originalError);
    this.name = 'AnalyticsConfigError';
  }
}

/**
 * Error thrown when validation fails
 */
export class AnalyticsValidationError extends AnalyticsError {
  constructor(
    message: string,
    public readonly validationErrors: any,
    originalError?: Error
  ) {
    super(message, 'ANALYTICS_VALIDATION_ERROR', originalError);
    this.name = 'AnalyticsValidationError';
  }
}
