import { memo } from 'react';
import Image from 'next/image';
import { Container } from '@/components/common/container';
import { DollarSign, Clock, AlertCircle, MessageSquare, Zap, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const painPoints = [
  {
    icon: DollarSign,
    headline: '$299-$999 Price Tags',
    description: '"Pro" boilerplates cost more than your first month\'s hosting. And they\'re usually buggy messes with zero support.',
  },
  {
    icon: Clock,
    headline: '3 Weeks of Setup Hell',
    description: 'Authentication alone takes 2 weeks. Then payments. Then email. Meanwhile, your competitor already launched.',
  },
  {
    icon: AlertCircle,
    headline: 'Outdated Dependencies',
    description: 'That $499 template uses Next.js 13 and has 47 security vulnerabilities. Good luck updating it.',
  },
  {
    icon: MessageSquare,
    headline: 'Zero Support',
    description: 'Paid $299 for a template, got an email bounce when you asked for help. Welcome to the boilerplate scam.',
  },
];

export const ProblemSolutionSection = memo(function ProblemSolutionSection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-background to-[var(--muted)]/20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl mb-4 scroll-fade-in">
            Tired of Choosing Between Expensive Boilerplates and Building from Scratch?
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] scroll-fade-in scroll-delay-100">
            You deserve better. Here&apos;s why most boilerplates fail you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Pain Points */}
          <div className="space-y-6 scroll-stagger">
            {painPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 scroll-slide-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-red-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">
                      {point.headline}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Solution Visual */}
          <div className="relative scroll-scale-up">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)]">
              <Image
                src="/images/problem-solution.png"
                alt="From frustration to shipping fast"
                width={600}
                height={400}
                className="w-full object-cover"
              />
              {/* Floating success badges */}
              <Badge className="absolute top-4 right-4 bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg">
                <Zap className="h-4 w-4 mr-2" aria-hidden="true" />
                Ship in 24 hours
              </Badge>
              <Badge className="absolute bottom-4 left-4 bg-green-500 text-white shadow-lg">
                <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                $0 cost
              </Badge>
            </div>
          </div>
        </div>

        {/* Transition Copy */}
        <div className="mt-16 text-center scroll-fade-in scroll-delay-300">
          <p className="text-2xl font-semibold text-[var(--foreground)] mb-4">
            Sound familiar? There&apos;s a better way.
          </p>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Get everything you need—auth, payments, database, deployment—
            pre-configured and production-ready. For $0.
          </p>
        </div>
      </Container>
    </section>
  );
});
