import { ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);