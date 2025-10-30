import { memo } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface FeatureShowcaseProps {
  title: string;
  description: string;
  image: string;
  highlights: string[];
  reverse?: boolean;
}

export const FeatureShowcase = memo(function FeatureShowcase({
  title,
  description,
  image,
  highlights,
  reverse = false,
}: FeatureShowcaseProps) {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'lg:order-2' : 'lg:order-1'}>
        <h3 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          {title}
        </h3>
        <p className="text-lg text-[var(--muted-foreground)] mb-6 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-3" role="list">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <Check className="h-3 w-3 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <span className="text-[var(--foreground)]">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? 'lg:order-1' : 'lg:order-2'}>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)]">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
});
