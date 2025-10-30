import { HeroSection } from "@/features/marketing/components/sections/hero";
import { SocialProofBar } from "@/features/marketing/components/sections/social-proof-bar";
import { ProblemSolutionSection } from "@/features/marketing/components/sections/problem-solution";
import { WhyUseThisSection } from "@/features/marketing/components/sections/why-use-this";
import { HowItWorksSection } from "@/features/marketing/components/sections/how-it-works";
import { ProductShowcaseSection } from "@/features/marketing/components/sections/product-showcase";
import { TestimonialsSection } from "@/features/marketing/components/sections/testimonials";
import { PricingSection } from "@/features/marketing/components/sections/pricing";
import { FAQSection } from "@/features/marketing/components/sections/faq";
import { WhyFreeSection } from "@/features/marketing/components/sections/why-free";
import { CTASection } from "@/features/marketing/components/sections/cta";
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar";
import { GridBackground } from "@/components/ui/grid-background";

export default function LandingPage() {
  return (
    <GridBackground gridSize={100} gridOpacity={0.03}>
      <ScrollProgressBar />
      <HeroSection />
      <SocialProofBar />
      <ProblemSolutionSection />
      <WhyUseThisSection />
      <HowItWorksSection />
      <ProductShowcaseSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <WhyFreeSection />
      <CTASection />
    </GridBackground>
  );
}