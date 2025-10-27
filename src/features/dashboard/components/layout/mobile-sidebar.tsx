'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '../../hooks/use-sidebar';
import { navigationItems } from '../../constants/navigation';
import { NavLink } from '../ui/nav-link';
import { NavUser } from '../navigation/nav-user';

export function MobileSidebar() {
  const { isOpen, isMobile, setOpen, setMobile } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setMobile(mobile);
      if (!mobile) {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile, setOpen]);

  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-[var(--border)] p-4">
          <SheetTitle asChild>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-xl">VibeSaaS</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex h-[calc(100vh-4rem)] flex-col">
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <div key={item.id} onClick={() => setOpen(false)}>
                  <NavLink item={item} />
                </div>
              ))}
            </nav>
          </ScrollArea>

          <div className="mt-auto">
            <NavUser />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}