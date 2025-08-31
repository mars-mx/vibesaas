import { DashboardSidebar } from './dashboard-sidebar';
import { MobileSidebar } from './mobile-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <DashboardSidebar />
      
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-[var(--border)] bg-[var(--background)] px-6 md:hidden">
          <MobileSidebar />
          <span className="text-lg font-semibold">VibeSaaS</span>
        </header>
        
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}