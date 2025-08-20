import { Container } from "@/components/common/container";
import { WHY_FREE_REASONS } from "@/features/marketing/constants";

export function WhyFreeSection() {
  return (
    <section id="why-free" className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-24 sm:py-32">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <Container className="relative">
        <div className="mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Why The{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Fuck
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 7 Q 25 0, 50 7 T 100 7"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              Is This Free?
            </h2>
            
            <p className="mx-auto mt-6 text-lg text-gray-400">
              Honest answer: We built this for ourselves and got tired of seeing developers get ripped off.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_FREE_REASONS.map((reason, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 backdrop-blur transition-all hover:border-purple-500/40 hover:bg-purple-500/10"
              >
                <div className="mb-4 text-4xl">{reason.emoji}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-purple-500/20 bg-gray-900/50 p-8 backdrop-blur">
            <p className="text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">No hidden agenda.</span>{" "}
              No premium version coming. No rug pull. Just developers helping developers ship faster.
            </p>
            <p className="mt-4 text-gray-300 leading-relaxed">
              If you make millions with this, buy us a beer. Or don&apos;t. We&apos;re not your mom.
            </p>
            <p className="mt-4 text-gray-300 leading-relaxed">
              The tools we use (Next.js, Convex, etc.) are already free, why shouldn&apos;t this be?
              Charging $500 for a Next.js template is predatory and we&apos;re calling it out.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}