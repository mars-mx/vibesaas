import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { GitHubLink } from "@/features/marketing/components/github-link";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl scroll-scale-up text-reveal-mask">
            Stop Reading. Start Shipping.
          </h2>
          <p className="mx-auto mt-4 text-xl text-muted-foreground scroll-fade-in scroll-delay-200">
            Your competition is using paid boilerplates. You&apos;re about to pass them for free.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="scroll-scale-up">
              <Link href="/sign-up">
                Launch Your SaaS Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <GitHubLink className="scroll-scale-up scroll-delay-100" />
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground scroll-fade-in scroll-delay-500">
            5-minute setup. No credit card. No bullshit.
          </p>
        </div>
      </Container>
    </section>
  );
}