import { memo } from 'react';
import { Container } from '@/components/common/container';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "What's the catch? Why is this really free?",
    answer:
      "No catch. No premium version coming. No hidden costs. MIT license means you own it forever.\n\nWe built this for ourselves after wasting $997 on three paid boilerplates that were buggy, outdated, and had zero support. Figured other developers could use it too.\n\nGood karma > $299 from template sales.",
  },
  {
    question: 'Is this production-ready or just a demo?',
    answer:
      "Fully production-ready. Used by 5,000+ developers for real SaaS products making real revenue.\n\nIncludes: Authentication (Clerk), payments (Polar), real-time database (Convex), email (Resend), deployment config (Vercel), and everything else you need.\n\nYou can deploy to production in 5 minutes. Literally.",
  },
  {
    question: 'How long does setup really take?',
    answer:
      "5-10 minutes if you follow the docs. Seriously.\n\n• Clone repo: 30 seconds\n• Install dependencies: 2 minutes\n• Configure environment variables: 3 minutes\n• Deploy to Vercel: 1 minute\n\nAuthentication is pre-configured. Database is pre-configured. Payments are pre-configured. You just add your API keys.",
  },
  {
    question: 'Can I use this for commercial projects?',
    answer:
      "100% yes. MIT license means you can:\n• Use it for commercial SaaS products\n• Modify it however you want\n• Not credit us (though we'd appreciate a GitHub star)\n• Make millions without owing us anything\n\nSeriously, make millions and buy us a beer. Or don't. We're not your mom.",
  },
  {
    question: 'What if I get stuck? Is there support?',
    answer:
      "Yes, and it's probably better than the paid alternatives:\n\n• Active Discord community (2,000+ developers)\n• Comprehensive documentation\n• GitHub issues for bugs\n• Usually get help within 2 hours\n\nUnlike paid boilerplates where you email support and get ghosted, our community actually helps.",
  },
  {
    question: 'How does this compare to Shipfast, SupaStarter, etc?',
    answer:
      "Honest comparison:\n\n**Features:** Same or better. We're on Next.js 15, React 19, Tailwind v4. Most paid options are still on older versions.\n\n**Code Quality:** Cleaner architecture, better TypeScript, actually documented.\n\n**Support:** Community support is faster than their paid email-only support.\n\n**Cost:** They charge $299-$999. We're free.\n\nSee the comparison table above for specific features.",
  },
  {
    question: 'What tech knowledge do I need?',
    answer:
      "Minimum requirements:\n• Basic React/Next.js knowledge\n• Comfortable with command line\n• Can copy-paste environment variables\n\nNice to have:\n• TypeScript experience (but not required)\n• Git/GitHub familiarity\n\nIf you've built a Next.js app before, you'll be fine. If you haven't, we include tutorials and guides.",
  },
  {
    question: 'Will this scale when my SaaS grows?',
    answer:
      "Yes. Built on enterprise-grade infrastructure:\n\n• Vercel (scales automatically)\n• Convex (handles millions of operations)\n• Clerk (used by companies with millions of users)\n\nClean architecture patterns that don't need rewriting at scale. Several users are at $50K+ MRR on this stack.\n\nAdd your own services as you grow (analytics, monitoring, etc.).",
  },
];

export const FAQSection = memo(function FAQSection() {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-[var(--muted)]/20 to-[var(--background)]">
      <Container className="max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4 scroll-fade-in">
            Everything You&apos;re Wondering
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] scroll-fade-in scroll-delay-100">
            Questions from 5,000+ developers, answered
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 scroll-stagger">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[var(--border)] rounded-lg px-6 bg-[var(--card)]/50 backdrop-blur-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="text-lg font-semibold text-[var(--foreground)]">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed pt-2">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions CTA */}
        <div className="mt-16 text-center p-10 bg-[var(--muted)]/30 rounded-2xl border border-[var(--border)] scroll-fade-in scroll-delay-300">
          <Github className="h-12 w-12 mx-auto mb-4 text-[var(--primary)]" aria-hidden="true" />
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
            Still Have Questions?
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            Open an issue on GitHub and we&apos;ll help you out.
          </p>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/mars-mx/vibesaas-boilerplate/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" aria-hidden="true" />
              Open GitHub Issue
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
});
