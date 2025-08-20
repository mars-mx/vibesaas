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

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-gradient-to-b from-background via-background/95 to-background">
      <Container>
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Pricing Is Revolutionary
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            Just kidding. There&apos;s no pricing. It&apos;s free.
          </p>
        </div>

        <div className="mx-auto mt-16 px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto w-full sm:w-[28rem] lg:w-[32rem]">
            {/* Enhanced glow effect with animation */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-primary/50 to-secondary opacity-20 blur-3xl animate-pulse" />
            
            {/* Enhanced Card */}
            <Card className="relative overflow-hidden border shadow-lg bg-card/95 backdrop-blur-sm">
              {/* Improved Popular badge */}
              <div className="absolute -right-12 top-6 rotate-45">
                <Badge className="px-12 py-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold">
                  POPULAR
                </Badge>
              </div>

              <CardHeader className="space-y-4 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Free Forever
                  </CardTitle>
                  <Badge variant="secondary" className="bg-success/15 text-success border-success/20 hover:bg-success/20 transition-colors">
                    100% FREE
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      $0
                    </span>
                    <span className="ml-2 text-xl text-muted-foreground">
                      /forever
                    </span>
                  </div>
                  <CardDescription className="text-sm">
                    Everything you need to build and scale your SaaS. No hidden fees, no surprises.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="border-t border-border/50 pt-6 pb-4">
                <ul className="space-y-3" role="list" aria-label="Included features">
                  {PRICING_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="mt-0.5 rounded-full bg-success/10 p-1 transition-colors group-hover:bg-success/15">
                        <Check className="h-4 w-4 text-success" aria-hidden="true" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t border-border/50 pt-6 pb-6">
                <Button className="w-full h-11 text-base font-semibold shadow-sm hover:shadow-md transition-shadow" size="lg" asChild>
                  <Link href="/sign-up" className="group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  No credit card required. Ever.
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Join thousands of developers building with VibeSaaS
          </p>
        </div>
      </Container>
    </section>
  );
}