'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { type NavigationItem } from '../../constants/navigation';

interface NavLinkProps {
  item: NavigationItem;
  collapsed?: boolean;
}

export function NavLink({ item, collapsed = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-[var(--accent)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
        isActive && 'bg-[var(--accent)] text-[var(--accent-foreground)]',
        collapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      {!collapsed && (
        <span className="flex-1">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--primary-foreground)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}