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

        <div className="mx-auto mt-16">
          <div className="relative mx-auto w-full sm:w-80 lg:w-96">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 opacity-40 blur-xl" />
            
            {/* Refined Card */}
            <Card className="relative overflow-hidden border shadow-lg bg-card/98 backdrop-blur-sm">
              {/* Compact Popular badge */}
              <div className="absolute -right-10 top-5 rotate-45">
                <Badge className="px-10 py-1 bg-primary/10 text-primary border-primary/20 font-medium text-xs">
                  POPULAR
                </Badge>
              </div>

              <CardHeader className="space-y-3 pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    Free Forever
                  </CardTitle>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      $0
                    </span>
                    <span className="ml-1 text-lg text-muted-foreground">
                      /forever
                    </span>
                  </div>
                  <CardDescription className="text-xs leading-relaxed">
                    Everything you need to build and scale your SaaS. No hidden fees, no surprises.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="border-t border-border/50 pt-4 pb-3">
                <ul className="space-y-2.5" role="list" aria-label="Included features">
                  {PRICING_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5 group">
                      <div className="mt-0.5 rounded-full bg-primary/8 p-1 transition-colors group-hover:bg-primary/12">
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-2.5 border-t border-border/50 pt-4 pb-5">
                <Button className="w-full h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow" size="default" asChild>
                  <Link href="/sign-up" className="group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <p className="text-center text-xs text-muted-foreground">
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