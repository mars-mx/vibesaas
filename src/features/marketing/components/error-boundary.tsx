"use client";

import { ErrorBoundary } from "react-error-boundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" aria-hidden="true" />
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        We encountered an error loading this section.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-xs text-muted-foreground mb-4 max-w-lg overflow-auto">
          {error.message}
        </pre>
      )}
      <Button onClick={resetErrorBoundary} variant="outline">
        Try Again
      </Button>
    </div>
  );
}

interface MarketingErrorBoundaryProps {
  children: React.ReactNode;
}

export function MarketingErrorBoundary({ children }: MarketingErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log to error reporting service in production
        console.error("Marketing section error:", error, errorInfo);
      }}
      onReset={() => {
        // Optionally clear any error state or retry data fetching
        console.log("Error boundary reset");
      }}
    >
      {children}
    </ErrorBoundary>
  );
}