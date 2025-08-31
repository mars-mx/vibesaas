'use client';

import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/features/marketing/components/ui/nav-link";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useHeaderTheme } from "@/features/marketing/hooks/use-header-theme";

export function MarketingHeader() {
  const { isSignedIn } = useUser();
  const { isOverDark, headerRef } = useHeaderTheme({
    checkInterval: 100,  // Check every 100ms
    darkThreshold: 0.5   // Consider dark if luminance < 50%
  });

  return (
    <header 
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full pt-4 transition-all duration-300 ease-in-out",
        isOverDark && "header-over-dark"
      )}
    >
      <Container>
        <div className="mx-auto w-full lg:w-[1152px]">
          <div className={cn(
            "flex h-16 items-center justify-between rounded-full border px-8 shadow-sm ring-1 transition-all duration-300 ease-in-out",
            "bg-[var(--background)]/80 backdrop-blur-xl",
            "border-[var(--border)]/20 shadow-[var(--foreground)]/5 ring-white/10 dark:ring-white/5",
            "hover:shadow-md hover:shadow-[var(--foreground)]/10",
            // Dynamic styles for dark backgrounds
            isOverDark && [
              "bg-white/10 dark:bg-black/10",
              "border-white/20 dark:border-white/10",
              "shadow-black/10 dark:shadow-white/5",
              "ring-white/20 dark:ring-white/10"
            ]
          )}>
            <Logo className={cn(
              "transition-colors duration-300 ease-in-out",
              isOverDark && "[&_span]:!text-white [&_span]:bg-none dark:[&_span]:!text-white dark:[&_span]:bg-none"
            )} />
            
            <nav className="hidden md:flex md:items-center md:gap-8" aria-label="Main navigation">
              <NavLink 
                href="#features"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isOverDark && "text-white/90 hover:text-white dark:text-white/90 dark:hover:text-white"
                )}
              >
                Features
              </NavLink>
              <NavLink 
                href="#pricing"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isOverDark && "text-white/90 hover:text-white dark:text-white/90 dark:hover:text-white"
                )}
              >
                Pricing
              </NavLink>
              <NavLink 
                href="#why-free"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isOverDark && "text-white/90 hover:text-white dark:text-white/90 dark:hover:text-white"
                )}
              >
                Why Free?
              </NavLink>
            </nav>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className={cn(
                      "hidden sm:inline-flex transition-colors duration-300 ease-in-out",
                      isOverDark && "text-white/90 hover:text-white hover:bg-white/10 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
                    )}
                  >
                    <Link href="/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                        userButtonPopoverCard: "z-[60]",
                      },
                    }}
                    userProfileProps={{
                      appearance: {
                        elements: {
                          rootBox: "z-[60]",
                        },
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className={cn(
                      "hidden sm:inline-flex transition-colors duration-300 ease-in-out",
                      isOverDark && "text-white/90 hover:text-white hover:bg-white/10 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
                    )}
                  >
                    <Link href="/sign-in">
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className={cn(
                      "hidden sm:inline-flex transition-all duration-300 ease-in-out",
                      isOverDark && "bg-white/90 text-black hover:bg-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                    )}
                  >
                    <Link href="/sign-up">
                      Get Started Free
                    </Link>
                  </Button>
                </>
              )}
              <MobileNav 
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isOverDark && "text-white/90 hover:text-white dark:text-white/90 dark:hover:text-white"
                )}
                isDarkBackground={isOverDark}
                isSignedIn={isSignedIn}
              />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}