import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StepCardProps {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  code?: string;
  highlight?: string;
}

export const StepCard = memo(function StepCard({
  number,
  icon: Icon,
  title,
  description,
  time,
  code,
  highlight,
}: StepCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
      {/* Step Number */}
      <div className="absolute -top-6 -right-6 text-8xl font-bold text-[var(--muted)]/20 select-none">
        {number}
      </div>

      <CardContent className="p-8 relative">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)] mb-6">
          <Icon className="h-8 w-8 text-[var(--primary-foreground)]" aria-hidden="true" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">
          {description}
        </p>

        {/* Time Badge */}
        <Badge variant="outline" className="mb-4">
          ⏱️ {time}
        </Badge>

        {/* Code snippet if provided */}
        {code && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--muted)]/30 border border-[var(--border)] overflow-x-auto">
            <code className="text-sm text-[var(--foreground)] font-mono break-all">
              {code}
            </code>
          </div>
        )}

        {/* Highlight if provided */}
        {highlight && (
          <p className="mt-4 text-sm text-[var(--primary)] font-medium">
            ✨ {highlight}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
