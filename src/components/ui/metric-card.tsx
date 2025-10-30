import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  number: string;
  label: string;
  icon: LucideIcon;
}

export const MetricCard = memo(function MetricCard({
  number,
  label,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary)]/10 mb-3">
        <Icon className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
      </div>
      <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
        {number}
      </div>
      <div className="text-sm text-[var(--muted-foreground)]">{label}</div>
    </div>
  );
});
