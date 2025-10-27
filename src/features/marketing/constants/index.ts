import { Shield, Zap, Heart, Coffee, Code, Database } from "lucide-react";
import type { Feature, PricingFeature, Reason, ComparisonFeature } from "../types";

export const FEATURES: Feature[] = [
  {
    id: "auth",
    title: "Authentication Ready",
    description: "Clerk auth pre-configured with protected routes, RBAC, and user management out of the box.",
    icon: Shield,
  },
  {
    id: "realtime",
    title: "Real-time Backend",
    description: "Convex gives you a real-time database, serverless functions, and WebSocket subscriptions.",
    icon: Zap,
  },
  {
    id: "modern",
    title: "Modern Stack",
    description: "Next.js 15, React 19, TypeScript, Tailwind v4. The latest and greatest, always.",
    icon: Heart,
  },
  {
    id: "dx",
    title: "Developer Experience",
    description: "Hot reload, TypeScript everywhere, proper error handling. Built by developers, for developers.",
    icon: Coffee,
  },
  {
    id: "production",
    title: "Production Ready",
    description: "SEO optimized, accessible, performant. Deploy to Vercel with one click and you're live.",
    icon: Database,
  },
  {
    id: "architecture",
    title: "Clean Architecture",
    description: "Feature-based structure, service patterns, proper separation of concerns. Scales with you.",
    icon: Code,
  },
];

export const PRICING_FEATURES: PricingFeature[] = [
  { text: "Unlimited projects", included: true },
  { text: "Authentication & user management", included: true },
  { text: "Real-time database", included: true },
  { text: "Payment integration ready", included: true },
  { text: "Email service integration", included: true },
  { text: "Production deployment", included: true },
  { text: "Community support", included: true },
  { text: "All future updates", included: true },
];

export const WHY_FREE_REASONS: Reason[] = [
  {
    emoji: "💡",
    title: "Built for ourselves",
    description: "We built this for our own projects and figured others could use it too.",
  },
  {
    emoji: "🌍",
    title: "Open source FTW",
    description: "Open source makes everything better through community contributions.",
  },
  {
    emoji: "🎯",
    title: "Good karma",
    description: "Good karma is worth more than a few hundred bucks from boilerplate sales.",
  },
  {
    emoji: "🚀",
    title: "Tools should be free",
    description: "The tools we use (Next.js, Convex, etc.) are free, why shouldn't this be?",
  },
  {
    emoji: "🖕",
    title: "Fuck gatekeeping",
    description: "Charging $500 for a starter template is predatory. We're calling it out.",
  },
  {
    emoji: "❤️",
    title: "Developer love",
    description: "We'd rather see 10,000 new products launch than make money selling templates.",
  },
];

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    feature: "Price",
    ours: { text: "Free Forever", highlight: true },
    theirs: { text: "$299 - $999", highlight: false }
  },
  {
    feature: "AI Integration",
    ours: { text: "Native Claude AI", highlight: true },
    theirs: { text: "DIY Integration", highlight: false }
  },
  {
    feature: "Real-time Features",
    ours: { text: "Built-in with Convex", highlight: true },
    theirs: { text: "Extra Setup Required", highlight: false }
  },
  {
    feature: "Payment Integration",
    ours: { text: "Pre-configured Polar", highlight: true },
    theirs: { text: "Manual Setup", highlight: false }
  },
  {
    feature: "Production Ready",
    ours: { text: "Day 1", highlight: true },
    theirs: { text: "Weeks of Setup", highlight: false }
  },
  {
    feature: "Community Support",
    ours: { text: "Open Source", highlight: true },
    theirs: { text: "Limited/Paid", highlight: false }
  }
];