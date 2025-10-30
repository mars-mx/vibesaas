import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, Shield, Heart, Users, Rocket, Github } from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CTASectionProps {
  variant?: 'default' | 'dark';
}

export function CTASection({ variant = 'default' }: CTASectionProps = {}) {
  const isDark = variant === 'dark';

  return (
    <section
      className={
        isDark
          ? "py-24 sm:py-32 bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden"
          : "py-24 sm:py-32 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--secondary)]/5 to-[var(--accent)]/10 relative overflow-hidden"
      }
      data-header-theme={isDark ? "dark" : undefined}
    >
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl" aria-hidden="true" />

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Social proof badge */}
          <Badge className="mb-6 px-4 py-2 bg-[var(--primary)]/20 border-[var(--primary)]/30 text-[var(--foreground)] scroll-fade-in">
            <Users className="mr-2 h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            127 developers started building this week
          </Badge>

          <h2 className={`text-5xl font-bold tracking-tight mb-6 scroll-scale-up text-reveal-mask ${
            isDark ? 'text-white' : 'text-[var(--foreground)]'
          }`}>
            Stop Reading. Start Shipping.
          </h2>

          <p className={`text-xl mb-10 scroll-fade-in scroll-delay-200 ${
            isDark ? 'text-white/80' : 'text-[var(--muted-foreground)]'
          }`}>
            Your competition is using paid boilerplates.
            You&apos;re about to pass them for free.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 scroll-stagger">
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="/sign-up" className="group">
                <Rocket className="mr-2 h-5 w-5" aria-hidden="true" />
                Launch Your SaaS Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
              <Link href="https://github.com/yourusername/vibesaas">
                <Github className="mr-2 h-5 w-5" aria-hidden="true" />
                View on GitHub
              </Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-[var(--muted-foreground)] scroll-fade-in scroll-delay-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <span>MIT licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <span>Free forever</span>
            </div>
          </div>

          {/* Avatar stack with social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 scroll-fade-in scroll-delay-400">
            <div className="flex -space-x-4 shrink-0">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Image
                  key={i}
                  src={`/avatars/${['sarah-chen', 'marcus-johnson', 'elena-rodriguez', 'ahmed-hassan', 'kate-williams', 'raj-patel'][i - 1]}.jpg`}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-[var(--background)]"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-[var(--foreground)]">Join 5,000+ developers</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                who shipped faster and saved money
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}