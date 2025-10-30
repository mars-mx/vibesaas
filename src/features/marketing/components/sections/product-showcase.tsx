import { memo } from 'react';
import Image from 'next/image';
import { Container } from '@/components/common/container';
import { Zap, Shield } from 'lucide-react';
import { FeatureShowcase } from '@/components/ui/feature-showcase';

export const ProductShowcaseSection = memo(function ProductShowcaseSection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-[var(--muted)]/20 to-[var(--background)]">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4 scroll-fade-in">
            See It In Action
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] scroll-fade-in scroll-delay-100">
            This is what you get, right out of the box
          </p>
        </div>

        {/* Main dashboard showcase with browser mockup */}
        <div className="relative max-w-6xl mx-auto mb-24 scroll-scale-up">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)]">
            {/* Browser chrome */}
            <div className="bg-[var(--muted)] px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true" />
              </div>
              <div className="flex-1 text-center text-sm text-[var(--muted-foreground)]">
                yoursaas.com/dashboard
              </div>
            </div>

            {/* Actual screenshot */}
            <Image
              src="/images/dashboard-full.png"
              alt="VibeSaaS Dashboard - Production Ready"
              width={1400}
              height={900}
              priority
              className="w-full"
            />
          </div>

          {/* Feature callouts with arrows */}
          <div className="hidden lg:block absolute top-1/4 -right-12 bg-white p-4 rounded-lg shadow-lg border border-[var(--border)] dark:bg-[var(--card)]">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm text-[var(--foreground)]">Real-time Updates</p>
                <p className="text-xs text-[var(--muted-foreground)]">Powered by Convex</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-1/4 -left-12 bg-white p-4 rounded-lg shadow-lg border border-[var(--border)] dark:bg-[var(--card)]">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm text-[var(--foreground)]">Built-in Auth</p>
                <p className="text-xs text-[var(--muted-foreground)]">Clerk ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid with screenshots */}
        <div className="grid md:grid-cols-2 gap-16 scroll-stagger">
          <FeatureShowcase
            title="Authentication That Just Works"
            description="Sign-up, sign-in, password reset, email verification, social auth. All pre-configured with Clerk."
            image="/images/feature-auth.png"
            highlights={[
              'Email + social authentication',
              'RBAC (role-based access control)',
              'User profile management',
              'Session handling',
            ]}
          />

          <FeatureShowcase
            title="Payments Without The Pain"
            description="Polar integration handles subscriptions, invoices, and webhooks. Focus on your product, not billing infrastructure."
            image="/images/feature-payments.png"
            highlights={[
              'Subscription management',
              'Webhook handling',
              'Invoice generation',
              'Payment history',
            ]}
            reverse
          />

          <FeatureShowcase
            title="Real-time Without The Headache"
            description="Convex backend gives you real-time queries, live updates, and serverless functions. No WebSocket configuration needed."
            image="/images/feature-realtime.png"
            highlights={[
              'Live database queries',
              'Real-time updates',
              'Serverless functions',
              'Zero infrastructure setup',
            ]}
          />

          <FeatureShowcase
            title="Responsive Out of The Box"
            description="Mobile-first design with Tailwind v4. Every component looks great on every device."
            image="/images/feature-mobile.png"
            highlights={[
              'Mobile-optimized',
              'Tablet-friendly',
              'Desktop-enhanced',
              'Touch-accessible',
            ]}
            reverse
          />
        </div>
      </Container>
    </section>
  );
});
