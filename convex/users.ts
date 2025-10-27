import { v } from "convex/values";
import { query, mutation, internalMutation, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { createChildLogger } from "./lib/logger";

/**
 * Get current user with hybrid data (Clerk session + Convex custom data)
 * Returns Clerk session data + custom app data from Convex
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const log = createChildLogger({ module: 'users', function: 'getCurrentUser' });
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      log.debug('No authenticated user identity found');
      return null;
    }
    
    log.debug({ clerkId: identity.subject }, 'Fetching user data');
    
    // Get custom app data from Convex database
    const customData = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    // Combine Clerk session data with custom data
    return {
      // Clerk session data (always current, no sync delay)
      clerkId: identity.subject,
      email: identity.email!,
      firstName: identity.givenName,
      lastName: identity.familyName,
      imageUrl: identity.pictureUrl,
      
      // Custom app data from Convex
      ...customData,
    };
  },
});

/**
 * Get custom user data by Clerk ID (internal use)
 */
export const getUserCustomDataByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

/**
 * Initialize user custom data on first sign-in
 * Only stores app-specific data, not Clerk data
 */
export const initializeUserCustomData = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const log = createChildLogger({ 
      module: 'users', 
      function: 'initializeUserCustomData',
      clerkId: args.clerkId 
    });
    
    log.info('Initializing user custom data');
    
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      log.debug('User already exists, skipping initialization');
      return existing._id;
    }

    // Create new user with default preferences
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      isOnboarded: false,
      preferences: {
        theme: "system" as const,
        notifications: true,
      },
      createdAt: now,
      updatedAt: now,
    });
    
    log.info({ userId }, 'User initialized successfully');
    return userId;
  },
});

/**
 * Delete user when deleted in Clerk
 */
export const deleteUserByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const log = createChildLogger({ 
      module: 'users', 
      function: 'deleteUserByClerkId',
      clerkId 
    });
    
    log.info('Deleting user data');
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
      log.info({ userId: user._id }, 'User deleted successfully');
    } else {
      log.warn('User not found for deletion');
    }
  },
});

/**
 * Update user onboarding status
 */
export const updateOnboardingStatus = mutation({
  args: { isOnboarded: v.boolean() },
  handler: async (ctx, { isOnboarded }) => {
    const log = createChildLogger({ 
      module: 'users', 
      function: 'updateOnboardingStatus' 
    });
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      log.error('Authentication failed - no identity');
      throw new Error("Not authenticated");
    }
    
    log.debug({ clerkId: identity.subject, isOnboarded }, 'Updating onboarding status');

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      log.error({ clerkId: identity.subject }, 'User not found');
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      isOnboarded,
      updatedAt: Date.now(),
    });
    
    log.info({ userId: user._id, isOnboarded }, 'Onboarding status updated');
  },
});

/**
 * Update user preferences
 */
export const updateUserPreferences = mutation({
  args: {
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    notifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const log = createChildLogger({ 
      module: 'users', 
      function: 'updateUserPreferences' 
    });
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      log.error('Authentication failed - no identity');
      throw new Error("Not authenticated");
    }
    
    log.debug({ clerkId: identity.subject, preferences: args }, 'Updating user preferences');

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      log.error({ clerkId: identity.subject }, 'User not found');
      throw new Error("User not found");
    }

    // Merge with existing preferences
    const updatedPreferences = {
      ...user.preferences,
      ...args,
    };

    await ctx.db.patch(user._id, {
      preferences: updatedPreferences,
      updatedAt: Date.now(),
    });
    
    log.info({ userId: user._id, preferences: updatedPreferences }, 'Preferences updated');
  },
});

/**
 * Webhook action for Clerk user lifecycle (called from Next.js API route)
 * Only handles custom data initialization and cleanup
 */
export const handleClerkWebhook = action({
  args: {
    eventType: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId?: any }> => {
    const log = createChildLogger({ 
      module: 'users', 
      function: 'handleClerkWebhook',
      eventType: args.eventType,
      clerkId: args.clerkId
    });
    
    log.info('Processing Clerk webhook');
    
    // Initialize user on first sign-in (from both user.created and session.created)
    if (args.eventType === 'user.created' || args.eventType === 'session.created') {
      const userId = await ctx.runMutation(internal.users.initializeUserCustomData, {
        clerkId: args.clerkId,
      });
      log.info({ userId }, 'User initialization webhook processed');
      return { success: true, userId };
    }

    // Delete user custom data when Clerk user is deleted
    if (args.eventType === 'user.deleted') {
      await ctx.runMutation(internal.users.deleteUserByClerkId, {
        clerkId: args.clerkId,
      });
      log.info('User deletion webhook processed');
      return { success: true };
    }

    // Ignore other events (user.updated, session.removed, etc.)
    // User profile data comes from Clerk session, not our database
    log.debug('Webhook event ignored (not relevant for custom data)');
    return { success: true };
  },
});

/**
 * Update user subscription status (called by Polar integration)
 */
export const updateSubscriptionStatus = internalMutation({
  args: {
    clerkId: v.string(),
    subscriptionStatus: v.optional(v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("incomplete"),
      v.literal("incomplete_expired"),
      v.literal("past_due"),
      v.literal("paused"),
      v.literal("trialing"),
      v.literal("unpaid")
    )),
    subscriptionId: v.optional(v.string()),
    productId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const log = createChildLogger({ 
      module: 'users', 
      function: 'updateSubscriptionStatus',
      clerkId: args.clerkId
    });
    
    log.info({ 
      subscriptionStatus: args.subscriptionStatus,
      subscriptionId: args.subscriptionId,
      productId: args.productId
    }, 'Updating subscription status');
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      log.error('User not found for subscription update');
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }

    await ctx.db.patch(user._id, {
      subscriptionStatus: args.subscriptionStatus,
      subscriptionId: args.subscriptionId,
      productId: args.productId,
      updatedAt: Date.now(),
    });
    
    log.info({ 
      userId: user._id,
      subscriptionStatus: args.subscriptionStatus 
    }, 'Subscription status updated successfully');
  },
});