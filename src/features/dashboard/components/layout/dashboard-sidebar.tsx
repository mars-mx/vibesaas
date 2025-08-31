'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSidebar } from '../../hooks/use-sidebar';
import { navigationItems } from '../../constants/navigation';
import { NavLink } from '../ui/nav-link';
import { NavUser } from '../navigation/nav-user';

export function DashboardSidebar() {
  const { isOpen, isMobile, toggle, setMobile } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-[var(--border)] bg-[var(--background)] transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
        {isOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">VibeSaaS</span>
          </Link>
        ) : (
          <div className="flex w-full justify-center">
            <span className="text-xl font-bold">V</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            'absolute -right-3 top-7 h-6 w-6 rounded-full border border-[var(--border)] bg-[var(--background)] shadow-sm',
            !isOpen && 'rotate-180'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{isOpen ? 'Collapse sidebar' : 'Expand sidebar'}</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink key={item.id} item={item} collapsed={!isOpen} />
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto">
        <NavUser />
      </div>
    </aside>
  );
}