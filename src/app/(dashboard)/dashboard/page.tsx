import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { WaitlistSignup } from './waitlist-signup';
import { checkWaitlistStatusAction } from '@/lib/actions/email.actions';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[var(--muted-foreground)]">Please sign in to continue</p>
      </div>
    );
  }

  // Get user email from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress || '';

  // Check if user is already in waitlist
  const { inWaitlist } = await checkWaitlistStatusAction();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <WaitlistSignup email={email} isInWaitlist={inWaitlist} />
    </div>
  );
}