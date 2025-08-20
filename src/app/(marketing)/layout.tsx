import { MarketingHeader } from "@/features/marketing/components/layout/marketing-header";
import { MarketingFooter } from "@/features/marketing/components/layout/marketing-footer";
import { MarketingErrorBoundary } from "@/features/marketing/components/error-boundary";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      <main className="flex-1">
        <MarketingErrorBoundary>
          {children}
        </MarketingErrorBoundary>
      </main>
      <MarketingFooter />
    </>
  );
}