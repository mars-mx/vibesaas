import type { LucideIcon } from "lucide-react";

export interface Feature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon?: LucideIcon;
  readonly highlighted?: boolean;
}

export interface PricingFeature {
  readonly text: string;
  readonly included: boolean;
}

export interface Reason {
  readonly emoji: string;
  readonly title: string;
  readonly description: string;
}