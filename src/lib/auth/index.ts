import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Get the current user ID from Clerk authentication
 * Redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return userId;
}

/**
 * Get the current user ID if authenticated, null otherwise
 */
export function getAuthUserId() {
  const { userId } = auth();
  return userId;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const { userId } = auth();
  return !!userId;
}