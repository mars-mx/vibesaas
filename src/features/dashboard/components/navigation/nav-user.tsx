'use client';

import { UserButton } from '@clerk/nextjs';

export function NavUser() {
  return (
    <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'h-10 w-10',
          },
        }}
      />
    </div>
  );
}