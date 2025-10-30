import { memo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestimonialCardProps {
  avatar: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
  metric: string;
}

export const TestimonialCard = memo(function TestimonialCard({
  avatar,
  name,
  role,
  company,
  rating,
  quote,
  metric,
}: TestimonialCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
      <CardContent className="p-6">
        {/* Avatar and Info */}
        <div className="flex items-start gap-4 mb-4">
          <Image
            src={avatar}
            alt={`${name} - ${role}`}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-[var(--foreground)]">{name}</h4>
            <p className="text-sm text-[var(--muted-foreground)]">
              {role} at {company}
            </p>
            {/* Star Rating */}
            <div className="flex gap-1 mt-1">
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-500 text-yellow-500"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="text-[var(--foreground)] mb-4 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Metric Badge */}
        <Badge className="bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20 hover:bg-[var(--primary)]/15">
          {metric}
        </Badge>
      </CardContent>
    </Card>
  );
});
