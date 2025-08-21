import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user ID (primary identifier)
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // User status and metadata
    isOnboarded: v.optional(v.boolean()),
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
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
    
  // Add more tables as needed for your app
  // e.g., projects, documents, etc.
});