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
    <section id="pricing" className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Pricing Is Revolutionary
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            Just kidding. There&apos;s no pricing. It&apos;s free.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl" />
            
            {/* Card */}
            <Card className="relative overflow-hidden shadow-xl">
              {/* Popular badge */}
              <Badge className="absolute -right-16 top-8 rotate-45 px-16 py-1">
                POPULAR
              </Badge>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    Free Forever
                  </CardTitle>
                  <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/10">
                    100% FREE
                  </Badge>
                </div>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight">
                    $0
                  </span>
                  <span className="ml-2 text-xl text-muted-foreground">
                    /forever
                  </span>
                </div>
                <CardDescription className="mt-4">
                  Everything you need to build and scale your SaaS. No hidden fees, no surprises.
                </CardDescription>
              </CardHeader>

              <CardContent className="border-t pt-6">
                <ul className="space-y-4">
                  {PRICING_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                      <span className="text-muted-foreground">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/sign-up">
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
        </div>
      </Container>
    </section>
  );
}