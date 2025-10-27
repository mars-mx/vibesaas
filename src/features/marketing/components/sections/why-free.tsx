import { Container } from "@/components/common/container";
import { WHY_FREE_REASONS } from "@/features/marketing/constants";

export function WhyFreeSection() {
  return (
    <section id="why-free" className="relative overflow-hidden bg-background py-24 sm:py-32">
      <Container className="relative">
        <div className="mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl scroll-fade-in">
              Why The{" "}
              <span className="relative inline-block">
                <span 
                  className="px-2 rounded"
                  style={{ 
                    backgroundColor: 'oklch(0.58 0.24 38)',
                    color: 'white'
                  }}
                >
                  Fuck
                </span>
              </span>{" "}
              Is This Free?
            </h2>
            
            <p className="mx-auto mt-6 text-lg text-muted-foreground scroll-fade-in scroll-delay-200">
              Honest answer: We built this for ourselves and got tired of seeing developers get ripped off.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 scroll-stagger">
            {WHY_FREE_REASONS.map((reason, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 p-6 backdrop-blur transition-all duration-300 hover:border-[var(--primary)]/30 hover:bg-[var(--card)]/80 hover:shadow-lg focus-within:border-[var(--primary)]/50 focus-within:ring-2 focus-within:ring-[var(--primary)]/20 card-hover-lift"
              >
                <div className="mb-4 text-4xl" role="img" aria-label={`${reason.title} icon`}>
                  {reason.emoji}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-8 backdrop-blur">
            <p className="text-foreground/90 leading-relaxed">
              <span className="font-semibold text-foreground">No hidden agenda.</span>{" "}
              No premium version coming. No rug pull. Just developers helping developers ship faster.
            </p>
            <p className="mt-4 text-foreground/90 leading-relaxed">
              If you make millions with this, buy us a beer. Or don&apos;t. We&apos;re not your mom.
            </p>
            <p className="mt-4 text-foreground/90 leading-relaxed">
              The tools we use (Next.js, Convex, etc.) are already free, why shouldn&apos;t this be?
              Charging $500 for a Next.js template is predatory and we&apos;re calling it out.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}