import { memo } from 'react';
import { Container } from "@/components/common/container";
import { FEATURES } from "@/features/marketing/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const WhyUseThisSection = memo(function WhyUseThisSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-gradient-to-b from-background via-primary/5 to-background">
      <Container>
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl scroll-fade-in">
            Built for Developers Who Ship, Not Shop
          </h2>
          <p className="mt-4 text-lg text-muted-foreground scroll-fade-in scroll-delay-100">
            Everything you need to launch your SaaS, nothing you don&apos;t.
          </p>
        </div>

        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:grid-cols-3 scroll-stagger">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={cn(
                  "relative group card-hover-lift",
                  index === 0 && "lg:col-span-1",
                  index === 1 && "lg:col-span-1",
                  index === 2 && "lg:col-span-1"
                )}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-0 blur transition-opacity group-hover:opacity-10" />
                <Card className="relative">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                      {Icon && <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {feature.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
});