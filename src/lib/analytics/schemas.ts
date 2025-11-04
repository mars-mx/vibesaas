/**
 * Analytics Zod Schemas
 *
 * Validation schemas for analytics events and properties.
 */

import { z } from 'zod';

/**
 * Base event properties schema
 */
export const baseEventPropertiesSchema = z.object({
  $set: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  $set_once: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
}).passthrough(); // Allow additional properties

/**
 * User traits schema
 */
export const userTraitsSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  plan: z.enum(['free', 'pro', 'business', 'enterprise']).optional(),
  subscriptionStatus: z
    .enum(['active', 'cancelled', 'past_due', 'trialing', 'incomplete'])
    .optional(),
  createdAt: z.string().optional(),
}).passthrough(); // Allow additional traits

/**
 * CTA click properties schema
 */
export const ctaClickPropertiesSchema = z.object({
  cta_location: z.string().min(1, 'CTA location is required'),
  cta_text: z.string().min(1, 'CTA text is required'),
  page_path: z.string().optional(),
  section: z.string().optional(),
});

/**
 * Page view properties schema
 */
export const pageViewPropertiesSchema = z.object({
  page_title: z.string().optional(),
  page_path: z.string().min(1, 'Page path is required'),
  referrer: z.string().optional(),
});

/**
 * Feature interaction properties schema
 */
export const featurePropertiesSchema = z.object({
  feature_name: z.string().min(1, 'Feature name is required'),
  feature_category: z.string().optional(),
  interaction_type: z.enum(['view', 'click', 'submit', 'toggle']).optional(),
});

/**
 * Authentication event properties schema
 */
export const authEventPropertiesSchema = z.object({
  method: z.enum(['email', 'google', 'github', 'oauth']).optional(),
  provider: z.string().optional(),
});

/**
 * Payment event properties schema
 */
export const paymentEventPropertiesSchema = z.object({
  plan: z.string().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  interval: z.enum(['month', 'year']).optional(),
  subscriptionId: z.string().optional(),
  productId: z.string().optional(),
});

/**
 * Analytics configuration schema
 */
export const analyticsConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  host: z.string().url('Invalid PostHog host URL'),
  enabled: z.boolean(),
  enableSessionReplay: z.boolean(),
  disableCookie: z.boolean(),
  debug: z.boolean(),
});

/**
 * Validate event properties based on event name
 */
export function validateEventProperties(eventName: string, properties: unknown): unknown {
  // For now, use base validation
  // Can be extended with event-specific validation
  return baseEventPropertiesSchema.parse(properties);
}
