'use client';

import { UserButton } from '@clerk/nextjs';

interface DashboardClientProps {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted-foreground)]">
              Welcome, {user.firstName || user.email}
            </span>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
              userProfileProps={{
                appearance: {
                  elements: {
                    rootBox: "z-50",
                  },
                },
              }}
            />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="rounded-lg border border-[var(--border)] bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
            <p className="text-[var(--muted-foreground)]">
              Welcome to your VibeSaaS dashboard! Your authentication is now working with Clerk and Convex.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold mb-2">User Profile</h3>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            </div>
            
            <div className="rounded-lg border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold mb-2">Next Steps</h3>
              <ul className="text-sm space-y-1 text-[var(--muted-foreground)]">
                <li>• Set up your Convex backend</li>
                <li>• Configure Polar for payments</li>
                <li>• Customize your dashboard</li>
                <li>• Add your app features</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}