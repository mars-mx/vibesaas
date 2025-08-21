import { v } from "convex/values";
import { query, mutation, internalMutation, action } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Get current user from Clerk authentication
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    // Get user from database using Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
      
    return user;
  },
});

/**
 * Get user by Clerk ID (used internally for syncing)
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

/**
 * Create or update user from Clerk webhook data
 * This is called from the Clerk webhook handler
 */
export const syncUserFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();
    const userData = {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      updatedAt: now,
    };

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, userData);
      return existing._id;
    } else {
      // Create new user
      return ctx.db.insert("users", {
        ...userData,
        isOnboarded: false,
        createdAt: now,
      });
    }
  },
});

/**
 * Delete user when deleted in Clerk
 */
export const deleteUserByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

/**
 * Update user onboarding status
 */
export const updateOnboardingStatus = mutation({
  args: { isOnboarded: v.boolean() },
  handler: async (ctx, { isOnboarded }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      isOnboarded,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Webhook action for Clerk user sync (called from Next.js API route)
 */
export const handleClerkWebhook = action({
  args: {
    eventType: v.string(),
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.eventType === 'user.created' || args.eventType === 'user.updated') {
      await ctx.runMutation(internal.users.syncUserFromClerk, {
        clerkId: args.clerkId,
        email: args.email || '',
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
      });
    } else if (args.eventType === 'user.deleted') {
      await ctx.runMutation(internal.users.deleteUserByClerkId, {
        clerkId: args.clerkId,
      });
    }
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
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error(`User with Clerk ID ${args.clerkId} not found`);
    }

    await ctx.db.patch(user._id, {
      subscriptionStatus: args.subscriptionStatus,
      subscriptionId: args.subscriptionId,
      productId: args.productId,
      updatedAt: Date.now(),
    });
  },
});