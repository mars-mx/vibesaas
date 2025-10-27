import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user ID (primary identifier) - REQUIRED for linking
    clerkId: v.string(),
    
    // Application-specific user data (not available in Clerk session)
    isOnboarded: v.optional(v.boolean()),
    preferences: v.optional(v.object({
      theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
      notifications: v.optional(v.boolean()),
    })),
    
    // Timestamps for audit trail
    createdAt: v.number(),
    updatedAt: v.number(),
    
    // Subscription tracking (synced with Polar via @convex-dev/polar)
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
  })
    .index("by_clerk_id", ["clerkId"]),
    
  // Add more tables as needed for your app
  // e.g., projects, documents, etc.
});