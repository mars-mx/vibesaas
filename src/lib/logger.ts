import pino from "pino";

/**
 * Logger for Next.js backend (API routes, server actions)
 * Configured for serverless/edge runtime compatibility
 */

const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // Simple configuration without worker threads for Next.js compatibility
  const baseConfig = {
    level: isDevelopment ? "debug" : (process.env.LOG_LEVEL || "info"),
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
      bindings: () => ({
        env: process.env.NODE_ENV || "production",
        service: "vibesaas-api",
      }),
    },
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
        "req.headers.authorization",
        "req.headers.cookie",
        'req.headers["svix-signature"]',
        'headers["svix-signature"]',
      ],
      censor: "[REDACTED]",
    },
  };
  
  // Don't use pino-pretty transport in Next.js as it uses worker threads
  // Instead, we'll use the base logger and format manually if needed
  return pino(baseConfig);
};

// Export singleton logger instance
export const logger = createLogger();

/**
 * Create a child logger with specific context
 * 
 * @example
 * const log = logger.child({ module: 'auth', userId: session.userId });
 * log.info('User authenticated successfully');
 */
export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context);
};