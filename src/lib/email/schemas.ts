/**
 * Zod schemas for email service validation
 * Provides runtime type checking and data transformation
 */

import { z } from 'zod';

/**
 * Schema for sending emails
 * Validates all parameters for email.send() operation
 */
export const sendEmailSchema = z
  .object({
    /** Recipient email address(es) */
    to: z.union([
      z.string().email().transform((s) => s.toLowerCase().trim()),
      z
        .array(z.string().email().transform((s) => s.toLowerCase().trim()))
        .min(1, 'At least one recipient is required'),
    ]),

    /** Email subject line */
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject too long'),

    /** Sender email address (optional, uses default if not provided) */
    from: z.string().email().optional(),

    /** React component for email body */
    react: z.any().optional(),

    /** HTML version of email body */
    html: z.string().optional(),

    /** Plain text version of email body */
    text: z.string().optional(),

    /** Reply-to email address(es) */
    replyTo: z
      .union([z.string().email(), z.array(z.string().email())])
      .optional(),

    /** CC recipients */
    cc: z
      .union([z.string().email(), z.array(z.string().email())])
      .optional(),

    /** BCC recipients */
    bcc: z
      .union([z.string().email(), z.array(z.string().email())])
      .optional(),

    /** Tags for categorizing emails */
    tags: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
        })
      )
      .optional(),

    /** Attachments */
    attachments: z
      .array(
        z.object({
          filename: z.string(),
          content: z.union([z.string(), z.instanceof(Buffer)]),
        })
      )
      .optional(),
  })
  .refine((data) => data.react || data.html || data.text, {
    message: 'At least one of react, html, or text must be provided',
  });

/**
 * Schema for adding contacts to an audience
 */
export const addContactSchema = z.object({
  /** Contact email address */
  email: z
    .string()
    .email('Invalid email address')
    .transform((s) => s.toLowerCase().trim()),

  /** Contact first name */
  firstName: z.string().min(1).optional(),

  /** Contact last name */
  lastName: z.string().optional(),

  /** Audience ID to add contact to */
  audienceId: z.string().uuid('Invalid audience ID'),

  /** Whether contact is unsubscribed */
  unsubscribed: z.boolean().default(false),
});

/**
 * Schema for removing contacts from an audience
 */
export const removeContactSchema = z.object({
  /** Contact email address */
  email: z
    .string()
    .email('Invalid email address')
    .transform((s) => s.toLowerCase().trim()),

  /** Audience ID to remove contact from */
  audienceId: z.string().uuid('Invalid audience ID'),
});

/**
 * Schema for batch email operations
 */
export const batchEmailSchema = z.object({
  /** Array of emails to send */
  emails: z.array(sendEmailSchema).min(1).max(100, 'Maximum 100 emails per batch'),
});
