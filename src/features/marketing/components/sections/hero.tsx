'use client';

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { siteConfig } from "@/lib/constants/site";
import { ANIMATION_ORB_SIZES, ANIMATION_ORB_POSITIONS, ANIMATION_ORB_COLORS } from "@/features/marketing/constants/animations";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className={`absolute ${ANIMATION_ORB_POSITIONS.topLeft} ${ANIMATION_ORB_SIZES.medium} rounded-full ${ANIMATION_ORB_COLORS.primary} blur-3xl`} />
        <div className={`absolute ${ANIMATION_ORB_POSITIONS.topRight} ${ANIMATION_ORB_SIZES.large} rounded-full ${ANIMATION_ORB_COLORS.secondary} blur-3xl`} />
        <div className={`absolute ${ANIMATION_ORB_POSITIONS.bottomCenter} ${ANIMATION_ORB_SIZES.small} rounded-full ${ANIMATION_ORB_COLORS.accent} blur-3xl`} />
      </div>

      <Container className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="mx-auto w-full py-12">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-8 flex items-center justify-center">
              <Badge variant="secondary" className="gap-2 px-3 py-1">
                <Zap className="h-4 w-4" />
                100% Free Forever. No BS.
              </Badge>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">Ship Your SaaS in 24 Hours,</span>
              <span className="block mt-2">
                Not Days. For{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    $<AnimatedCounter
                      from={500}
                      to={0}
                      duration={5000}
                      delay={500}
                      easing="easeOutExpo"
                      separator=""
                      decimals={0}
                      ariaLabel="Price"
                    />
                  </span>
                  <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary to-secondary" />
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
              The only production-ready boilerplate that doesn&apos;t cost a fortune. 
              Because charging $500 for a starter template is bullshit.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-12 sm:mt-16 text-sm text-muted-foreground">
              <p>Trusted by 10,000+ developers shipping real products</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}