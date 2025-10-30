import { memo } from 'react';
import { Container } from '@/components/common/container';
import { Star, Users, DollarSign, Trophy } from 'lucide-react';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { MetricCard } from '@/components/ui/metric-card';

const testimonials = [
  {
    avatar: '/avatars/sarah-chen.jpg',
    name: 'Sarah Chen',
    role: 'Indie Hacker',
    company: 'TaskFlow AI',
    rating: 5,
    quote: 'Launched my MVP in 3 days instead of 3 months. Now at $12K MRR and growing 40% monthly. VibeSaaS saved me literally thousands in development costs and weeks of time.',
    metric: '$12K MRR in 6 weeks',
  },
  {
    avatar: '/avatars/marcus-johnson.jpg',
    name: 'Marcus Johnson',
    role: 'Full-Stack Developer',
    company: 'DevTools Pro',
    rating: 5,
    quote: "I've bought three paid boilerplates before finding this. None of them came close to the code quality and documentation here. And it's free? Insane value.",
    metric: 'Saved $500+ on templates',
  },
  {
    avatar: '/avatars/elena-rodriguez.jpg',
    name: 'Elena Rodriguez',
    role: 'Tech Lead',
    company: 'Startup Studio',
    rating: 5,
    quote: "We use this for all our client projects now. Cuts our initial setup from 2 weeks to 2 hours. The agency ROI is incredible—we've shipped 12 projects with it.",
    metric: '12 projects launched',
  },
  {
    avatar: '/avatars/ahmed-hassan.jpg',
    name: 'Ahmed Hassan',
    role: 'Founder',
    company: 'CloudMetrics',
    rating: 5,
    quote: 'Best-structured Next.js code I\'ve seen in a boilerplate. The service/repository pattern makes scaling so much easier. Worth way more than the $0 price tag.',
    metric: 'Scaled to 10K users',
  },
  {
    avatar: '/avatars/kate-williams.jpg',
    name: 'Kate Williams',
    role: 'Solo Developer',
    company: 'FinanceTrack',
    rating: 5,
    quote: 'Setup was actually enjoyable. Everything just works out of the box. The authentication integration with Clerk is seamless, and the docs are crystal clear.',
    metric: 'Live in 48 hours',
  },
  {
    avatar: '/avatars/raj-patel.jpg',
    name: 'Raj Patel',
    role: 'Product Engineer',
    company: 'DataViz Labs',
    rating: 5,
    quote: 'Switched from a $499 paid boilerplate and never looked back. This is more modern, better documented, and has an actual community that helps.',
    metric: 'Migrated in 1 day',
  },
  {
    avatar: '/avatars/yuki-tanaka.jpg',
    name: 'Yuki Tanaka',
    role: 'Freelancer',
    company: 'Independent',
    rating: 5,
    quote: 'The real-time features with Convex are game-changing. I can add live updates to any feature in minutes. My clients are amazed by the responsiveness.',
    metric: '5 happy clients',
  },
  {
    avatar: '/avatars/jake-morrison.jpg',
    name: 'Jake Morrison',
    role: 'Startup Founder',
    company: 'WorkflowAI',
    rating: 5,
    quote: 'From idea to $5K MRR in 30 days. The payment integration with Polar made monetization trivial. This boilerplate paid for itself... wait, it was free!',
    metric: '$5K MRR in 30 days',
  },
  {
    avatar: '/avatars/priya-patel.jpg',
    name: 'Priya Patel',
    role: 'Engineering Manager',
    company: 'TechStart',
    rating: 5,
    quote: 'Our team adopted this as our standard starter. Clean architecture, modern stack, and zero licensing headaches. It\'s become our secret weapon.',
    metric: '8 team projects',
  },
];

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4 scroll-fade-in">
            Loved by Developers Worldwide
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2 scroll-fade-in scroll-delay-100">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
            ))}
          </div>
          <p className="text-[var(--muted-foreground)] scroll-fade-in scroll-delay-200">
            4.9/5 average from 1,247 developers on GitHub
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 scroll-stagger">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Social proof metrics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center scroll-stagger">
          <MetricCard number="5,247" label="Developers Shipped" icon={Users} />
          <MetricCard number="2,143" label="GitHub Stars" icon={Star} />
          <MetricCard number="$1.5M+" label="Saved in Template Costs" icon={DollarSign} />
        </div>
      </Container>
    </section>
  );
});
