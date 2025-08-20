import { memo } from 'react';
import { Container } from "@/components/common/container";
import { FEATURES, COMPARISON_FEATURES } from "@/features/marketing/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const WhyUseThisSection = memo(function WhyUseThisSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-background">
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

        {/* Modern Comparison Section */}
        <div className="mt-20 sm:mt-24">
          {/* Enhanced Headline */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl scroll-fade-in">
              Why Choose to Vibe?
            </h3>
            <p className="mt-4 text-lg text-muted-foreground scroll-fade-in scroll-delay-100">
              See how we stack up against the competition.
            </p>
          </div>

          {/* Card-based Comparison */}
          <div className="w-full lg:w-[1152px] mx-auto">
            {/* Header Cards - Three columns to match table */}
            <Card className="mb-8 overflow-hidden scroll-scale-up">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                {/* Feature Column Header - Empty */}
                <div className="p-6">
                  {/* Intentionally left empty */}
                </div>
                
                {/* VibeSaaS Column Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-primary">VibeSaaS</h4>
                    <p className="text-sm text-muted-foreground mt-1">The Modern Choice</p>
                  </div>
                </div>

                {/* Other Boilerplates Column Header */}
                <div className="p-6 text-center bg-muted/10">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-muted-foreground">Others</h4>
                  <p className="text-sm text-muted-foreground mt-1">The Status Quo</p>
                </div>
              </div>
            </Card>

            {/* Comparison Features */}
            <div className="space-y-4 scroll-stagger">
              {COMPARISON_FEATURES.map((item, index) => (
                <Card key={index} className="p-0 overflow-hidden scroll-slide-right">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                    {/* Feature Name */}
                    <div className="flex items-center justify-center p-6 bg-muted/30">
                      <h5 className="font-semibold text-center text-foreground">
                        {item.feature}
                      </h5>
                    </div>

                    {/* VibeSaaS (Ours) */}
                    <div className="flex items-center justify-center p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-semibold text-primary text-center">
                          {item.ours.text}
                        </span>
                      </div>
                    </div>

                    {/* Other Boilerplates */}
                    <div className="flex items-center justify-center p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-muted-foreground text-center">
                          {item.theirs.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
});