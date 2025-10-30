import { memo } from 'react';
import { Container } from '@/components/common/container';
import { Star, Users } from 'lucide-react';
import Image from 'next/image';

const techLogos = [
  { name: 'Vercel', src: '/logos/vercel.svg', href: 'https://vercel.com', width: 120, height: 26, showLabel: false },
  { name: 'GitHub', src: '/logos/github.png', href: 'https://github.com', width: 100, height: 32, showLabel: false },
  { name: 'Clerk', src: '/logos/clerk.svg', href: 'https://clerk.com', width: 90, height: 32, showLabel: false },
  { name: 'Polar', src: '/logos/polar.svg', href: 'https://polar.sh', width: 32, height: 32, showLabel: true },
  { name: 'Convex', src: '/logos/convex.svg', href: 'https://convex.dev', width: 180, height: 32, showLabel: false },
];

export const SocialProofBar = memo(function SocialProofBar() {
  return (
    <section className="py-12 border-y border-[var(--border)] bg-[var(--muted)]/30">
      <Container>
        <p className="text-center text-sm text-[var(--muted-foreground)] mb-8">
          Built with:
        </p>

        {/* Company logos */}
        <div className="flex justify-center items-center gap-12 mb-8 flex-wrap opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
          {techLogos.map((tech) => (
            <a
              key={tech.name}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200 flex items-center gap-2"
              aria-label={tech.name}
            >
              <Image
                src={tech.src}
                alt={`${tech.name} logo`}
                width={tech.width}
                height={tech.height}
                className="h-6 w-auto"
              />
              {tech.showLabel && (
                <span className="text-[var(--foreground)] text-base font-semibold">
                  {tech.name}
                </span>
              )}
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-8 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
            <span className="text-[var(--foreground)]">4.9/5 from 2,143 stars</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            <span className="text-[var(--foreground)]">5,000+ developers</span>
          </div>
        </div>
      </Container>
    </section>
  );
});
