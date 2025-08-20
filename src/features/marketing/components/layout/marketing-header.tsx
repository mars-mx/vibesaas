import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/features/marketing/components/ui/nav-link";

export function MarketingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-4">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="flex h-16 items-center justify-between rounded-full border border-border/20 bg-background/80 backdrop-blur-xl px-8 shadow-sm shadow-foreground/5 ring-1 ring-white/10 dark:ring-white/5 transition-shadow hover:shadow-md hover:shadow-foreground/10">
            <Logo />
            
            <nav className="hidden md:flex md:items-center md:gap-8" aria-label="Main navigation">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#why-free">Why Free?</NavLink>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/sign-up">
                  Get Started Free
                </Link>
              </Button>
              <MobileNav />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}