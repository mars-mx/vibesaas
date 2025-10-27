"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { convex } from "@/lib/convex/client";

interface ConvexClerkProviderProps {
  children: React.ReactNode;
}

export function ConvexClerkProvider({ children }: ConvexClerkProviderProps) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}