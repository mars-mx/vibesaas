import pino from "pino";

/**
 * Logger for Convex backend functions
 * Note: In Convex's serverless environment, logs are captured by the platform
 * and can be viewed using `npx convex logs` or in the Convex dashboard
 */

// Create base logger with appropriate configuration for Convex
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  return pino({
    level: isDevelopment ? "debug" : "info",
    // In Convex, we use JSON format for structured logging
    // Pretty printing is handled by the Convex CLI/dashboard
    formatters: {
      level: (label) => {
        return { level: label };
      },
      bindings: () => ({
        // Add environment context
        env: process.env.NODE_ENV || "development",
      }),
    },
    // Add timestamp for better tracing
    timestamp: pino.stdTimeFunctions.isoTime,
    // Redact sensitive fields
    redact: {
      paths: [
        "password",
        "token",
        "apiKey",
        "secret",
        "authorization",
        "cookie",
        "*.password",
        "*.token",
        "*.apiKey",
        "*.secret",
      ],
      censor: "[REDACTED]",
    },
  });
};

// Export singleton logger instance
export const logger = createLogger();

/**
 * Create a child logger with specific context
 * Useful for adding module/function context
 * 
 * @example
 * const log = createChildLogger({ module: 'users', function: 'getCurrentUser' });
 * log.info({ userId: '123' }, 'Fetching user data');
 */
export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

/**
 * Log levels for reference:
 * - fatal: System is unusable
 * - error: Error events
 * - warn: Warning events
 * - info: Informational messages
 * - debug: Debug-level messages
 * - trace: Trace-level messages (most verbose)
 */