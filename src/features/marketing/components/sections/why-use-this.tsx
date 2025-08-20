import { Container } from "@/components/common/container";
import { FEATURES } from "@/features/marketing/constants";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function WhyUseThisSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-background">
      <Container>
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for Developers Who Ship, Not Shop
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to launch your SaaS, nothing you don&apos;t.
          </p>
        </div>

        <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={cn(
                  "relative group",
                  index === 0 && "lg:col-span-1",
                  index === 1 && "lg:col-span-1",
                  index === 2 && "lg:col-span-1"
                )}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-0 blur transition-opacity group-hover:opacity-10" />
                <Card className="relative">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                      {Icon && <Icon className="h-6 w-6 text-primary-foreground" />}
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

        {/* Time saved indicator */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary to-secondary p-[2px]">
          <div className="rounded-2xl bg-background p-8">
            <div className="mx-auto text-center">
              <p className="text-2xl font-bold text-foreground">
                = 240+ hours saved. $0 spent.
              </p>
              <p className="mt-2 text-muted-foreground">
                Stop reinventing the wheel. Start shipping features.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}