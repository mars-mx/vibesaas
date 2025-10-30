import { memo } from 'react';
import { Container } from '@/components/common/container';
import { Download, Palette, Rocket } from 'lucide-react';
import { StepCard } from '@/components/ui/step-card';

export const HowItWorksSection = memo(function HowItWorksSection() {
  return (
    <section className="py-24 sm:py-32 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4 scroll-fade-in">
            Ship in 3 Simple Steps
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] scroll-fade-in scroll-delay-100">
            From clone to production in under 30 minutes. Seriously.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative scroll-stagger">
          <StepCard
            number="01"
            icon={Download}
            title="Clone & Configure"
            description="One command gets you started. Copy your .env variables. You're 80% done."
            time="5 minutes"
            code="git clone https://github.com/mars-mx/vibesaas"
          />

          <StepCard
            number="02"
            icon={Palette}
            title="Customize Your Brand"
            description="Update colors, add your logo, tweak the copy. Make it uniquely yours."
            time="15 minutes"
            highlight="No rebuild needed for most changes"
          />

          <StepCard
            number="03"
            icon={Rocket}
            title="Deploy & Scale"
            description="Push to GitHub, connect Vercel. Your SaaS is live and ready for customers."
            time="5 minutes"
            highlight="One-click deployment"
          />
        </div>

      </Container>
    </section>
  );
});
