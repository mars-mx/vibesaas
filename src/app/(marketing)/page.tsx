import { HeroSection } from "@/features/marketing/components/sections/hero";
import { WhyUseThisSection } from "@/features/marketing/components/sections/why-use-this";
import { PricingSection } from "@/features/marketing/components/sections/pricing";
import { WhyFreeSection } from "@/features/marketing/components/sections/why-free";
import { CTASection } from "@/features/marketing/components/sections/cta";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <WhyUseThisSection />
      <PricingSection />
      <WhyFreeSection />
      <CTASection />
    </>
  );
}