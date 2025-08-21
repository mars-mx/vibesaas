'use client';

import { memo } from 'react';
import Link from "next/link";
import { Zap } from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitHubLink } from "@/features/marketing/components/github-link";
import { motion } from "framer-motion";
import { HeroTitle, AnimatedDiv, scaleInVariants } from "@/components/ui/motion";


export const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">

      <Container className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="mx-auto w-full py-12">
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
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    $0
                  </span>
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
                <Link href="/docs/quickstart">
                  Get Started Free
                </Link>
              </Button>
              <GitHubLink />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
});