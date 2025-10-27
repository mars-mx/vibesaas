'use client';

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/common/container";
import { PRICING_FEATURES } from "@/features/marketing/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export function PricingSection() {
  const { isSignedIn } = useUser();
  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-gradient-to-b from-background via-background/95 to-background">
      <Container>
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl scroll-fade-in">
            Our Pricing Is Revolutionary
          </h2>
          <p className="mt-4 text-lg text-foreground-muted scroll-fade-in scroll-delay-200">
            Just kidding. There&apos;s no pricing. It&apos;s free.
          </p>
        </div>

        <div className="mx-auto mt-16 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center scroll-stagger">
            {/* Starter Plan */}
            <Card className="relative overflow-hidden border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all h-[420px] flex flex-col card-flip-scroll">
              <CardHeader className="space-y-3 pt-5 pb-3">
                <CardTitle className="text-xl font-bold">
                  Starter
                </CardTitle>

                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight">
                      $0
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <CardDescription className="text-xs">
                    Perfect for getting started
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="border-t border-border/50 pt-4 pb-3 flex-1">
                <ul className="space-y-2" role="list">
                  {PRICING_FEATURES.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 scroll-slide-left">
                      <div className="mt-0.5 rounded-full bg-success/10 p-0.5">
                        <Check className="h-3 w-3 text-success" aria-hidden="true" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="border-t border-border/50 pt-4 pb-5 mt-auto">
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link href={isSignedIn ? "/dashboard" : (process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in")}>
                    {isSignedIn ? "Dashboard" : "Get Started"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan - Highlighted */}
            <Card className="relative overflow-hidden border shadow-xl bg-card/95 backdrop-blur-sm md:scale-105 card-flip-scroll scroll-delay-200">
              {/* Popular badge */}
              <div className="absolute -right-12 top-5 rotate-45 z-10">
                <Badge className="px-12 py-1 font-semibold text-xs shadow-lg !bg-primary !text-primary-foreground border-0">
                  POPULAR
                </Badge>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-primary/50 to-secondary opacity-10 blur-2xl -z-10" />

              <CardHeader className="space-y-3 pt-5 pb-3">
                <CardTitle className="text-xl font-bold">
                  Pro
                </CardTitle>

                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      $0
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      /forever
                    </span>
                  </div>
                  <CardDescription className="text-xs">
                    Everything you need to scale
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="border-t border-border/50 pt-4 pb-3">
                <ul className="space-y-2" role="list">
                  {PRICING_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 group scroll-slide-left">
                      <div className="mt-0.5 rounded-full bg-success/10 p-0.5 transition-colors group-hover:bg-success/15">
                        <Check className="h-3 w-3 text-success" aria-hidden="true" />
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 border-t border-border/50 pt-4 pb-5">
                <Button className="w-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow" asChild>
                  <Link href={isSignedIn ? "/dashboard" : (process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in")} className="group">
                    <span className="inline-flex items-center">
                      {isSignedIn ? "Dashboard" : "Get Started Free"}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {isSignedIn ? "You're already in!" : "No credit card required"}
                </p>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative overflow-hidden border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all h-[420px] flex flex-col card-flip-scroll scroll-delay-400">
              <CardHeader className="space-y-3 pt-5 pb-3">
                <CardTitle className="text-xl font-bold">
                  Enterprise
                </CardTitle>

                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight">
                      $0
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      /forever
                    </span>
                  </div>
                  <CardDescription className="text-xs">
                    For large-scale applications
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="border-t border-border/50 pt-4 pb-3 flex-1">
                <ul className="space-y-2" role="list">
                  {[...PRICING_FEATURES.slice(0, 5), { text: "Priority support" }, { text: "Custom integrations" }].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 scroll-slide-left">
                      <div className="mt-0.5 rounded-full bg-success/10 p-0.5">
                        <Check className="h-3 w-3 text-success" aria-hidden="true" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="border-t border-border/50 pt-4 pb-5 mt-auto">
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link href={isSignedIn ? "/dashboard" : (process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in")}>
                    {isSignedIn ? "Dashboard" : "Get Started"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-center text-sm text-muted-foreground scroll-fade-in scroll-delay-500">
            Join thousands of developers building with VibeSaaS
          </p>
        </div>
      </Container>
    </section>
  );
}
