'use client';

import { memo } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Zap, Shield } from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitHubLink } from "@/features/marketing/components/github-link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroTitle, AnimatedDiv, scaleInVariants } from "@/components/ui/motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useUser } from "@clerk/nextjs";
import { useRef } from "react";


export const HeroSection = memo(function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <>
      {/* Hero Content - Full Height */}
      <section className="relative h-screen overflow-hidden bg-background">
        <Container className="relative flex h-screen items-center justify-center">
          <div className="mx-auto w-full">
            <div className="text-center">
              {/* Badge */}
              <AnimatedDiv className="mb-8 flex items-center justify-center" variants={scaleInVariants}>
                <Badge className="gap-2 px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  100% Free Forever. No BS.
                </Badge>
              </AnimatedDiv>

              {/* Main headline */}
              <HeroTitle className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block">Ship Your SaaS in 24 Hours,</span>
                <span className="block mt-2">
                  Not Days. For{" "}
                  <span className="relative inline-block">
                    <AnimatedCounter
                      from={299}
                      to={0}
                      duration={5000}
                      delay={500}
                      prefix="$"
                      className="inline-block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent"
                      ariaLabel="Price countdown"
                    />
                  </span>
                </span>
              </HeroTitle>

              {/* Subheadline */}
              <AnimatedDiv className="mx-auto mt-6 w-full sm:w-[640px] lg:w-[672px]">
                <p className="text-lg text-muted-foreground">
                  Stop paying for overpriced boilerplates. Get a production-ready SaaS starter with auth, payments, and real-time features. MIT licensed. Clone and ship.
                </p>
              </AnimatedDiv>

              {/* CTA Buttons */}
              <motion.div
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <Button size="lg" asChild>
                  <Link href={isSignedIn ? "/dashboard" : (process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in")}>
                    {isSignedIn ? "Dashboard" : "Get Started Free"}
                  </Link>
                </Button>
                <GitHubLink />
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero Product Screenshot - Separate Section */}
      <section className="py-20 bg-background">
        <Container>
          <div className="relative max-w-6xl mx-auto scroll-fade-in">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--accent)]/20 blur-3xl" aria-hidden="true" />

            {/* Browser mockup */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--border)]">
              {/* Browser chrome */}
              <div className="bg-[var(--muted)] px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true" />
                  <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true" />
                </div>
                <div className="flex-1 text-center text-sm text-[var(--muted-foreground)]">
                  yoursaas.com/dashboard
                </div>
              </div>

              {/* Dashboard screenshot */}
              <Image
                src="/images/hero-dashboard.png"
                alt="VibeSaaS Dashboard - Production Ready SaaS Template"
                width={1400}
                height={900}
                priority
                className="w-full"
              />
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-semibold">Production Ready</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-white text-foreground px-4 py-2 rounded-lg shadow-lg border border-[var(--border)] dark:bg-[var(--card)]"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                <span className="text-sm font-semibold">MIT Licensed</span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
});