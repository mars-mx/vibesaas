import Link from "next/link";
import { Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { NavLink } from "@/features/marketing/components/ui/nav-link";

interface MobileNavProps {
  className?: string;
  isDarkBackground?: boolean;
  isSignedIn?: boolean;
}

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#why-free", label: "Why Free?" },
];

export function MobileNav({ className, isDarkBackground, isSignedIn }: MobileNavProps) {
  return (
    <details className={cn("relative md:hidden group", className)}>
      <summary className={cn(
        "list-none cursor-pointer inline-flex items-center justify-center rounded-md p-2 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
        isDarkBackground 
          ? "text-white/90 hover:bg-white/10 hover:text-white" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}>
        <Menu className="h-6 w-6 group-open:hidden" aria-hidden="true" />
        <X className="h-6 w-6 hidden group-open:block" aria-hidden="true" />
        <span className="sr-only">Toggle menu</span>
      </summary>
      
      {/* Mobile menu panel */}
      <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl bg-background shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
        <nav className="py-2" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-base"
            >
              {item.label}
            </NavLink>
          ))}
          
          <hr className="my-2 border-border" />
          
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md mx-2"
              >
                Dashboard
              </Link>
              <div className="px-4 py-2 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Account</span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-7 w-7",
                    },
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="block px-4 py-2 text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md mx-2"
              >
                Sign In
              </Link>
              
              <Link
                href="/sign-up"
                className="block px-4 py-2 mx-2 my-2 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors rounded-md text-center"
              >
                Get Started Free
              </Link>
            </>
          )}
        </nav>
      </div>
      
      {/* Backdrop that auto-closes menu when clicked anywhere outside */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden group-open:block md:hidden"
        aria-hidden="true"
      />
    </details>
  );
}