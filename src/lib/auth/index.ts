import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Get the current user ID from Clerk authentication
 * Redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return userId;
}

/**
 * Get the current user ID if authenticated, null otherwise
 */
export async function getAuthUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const { userId } = await auth();
  return !!userId;
}