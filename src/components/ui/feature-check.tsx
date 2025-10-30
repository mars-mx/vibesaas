import { memo } from 'react';
import { Check } from 'lucide-react';

interface FeatureCheckProps {
  text: string;
}

export const FeatureCheck = memo(function FeatureCheck({ text }: FeatureCheckProps) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
        <Check className="h-3 w-3 text-[var(--primary)]" aria-hidden="true" />
      </div>
      <span className="text-[var(--foreground)]">{text}</span>
    </li>
  );
});
