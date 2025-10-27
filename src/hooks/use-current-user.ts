"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

/**
 * Hook to get the current user from Convex database
 * This provides the full user record with subscription status, etc.
 */
export function useCurrentUser() {
  const { isSignedIn } = useUser();
  
  // Only query if user is signed in to avoid unnecessary requests
  const user = useQuery(
    api.users.getCurrentUser,
    isSignedIn ? {} : "skip"
  );

  return {
    user,
    isLoading: isSignedIn && user === undefined,
  };
}