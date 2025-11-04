'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Input } from '@/components/ui/input';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { addToWaitlistAction, removeFromWaitlistAction } from '@/lib/actions/email.actions';
import { useAnalytics } from '@/lib/analytics/hooks/use-analytics';

interface WaitlistSignupProps {
  email: string;
  isInWaitlist: boolean;
}

export function WaitlistSignup({ email, isInWaitlist: initialIsInWaitlist }: WaitlistSignupProps) {
  const router = useRouter();
  const analytics = useAnalytics();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isInWaitlist, setIsInWaitlist] = useState(initialIsInWaitlist);

  const handleJoinWaitlist = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await addToWaitlistAction();

      if (result.success) {
        // Track waitlist join event
        analytics.trackWaitlistJoin(email);
        // Fire confetti celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);

          // Left side confetti
          confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });

          // Right side confetti
          confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);

        // Update local state immediately for instant UI feedback
        setIsInWaitlist(true);

        // Refresh server data in the background for validation
        startTransition(() => {
          router.refresh();
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to join waitlist. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveWaitlist = async () => {
    setIsRemoving(true);
    setMessage(null);

    try {
      const result = await removeFromWaitlistAction();

      if (result.success) {
        setShowLeaveDialog(false);
        // Update local state immediately for instant UI feedback
        setIsInWaitlist(false);

        // Refresh server data in the background for validation
        startTransition(() => {
          router.refresh();
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to leave waitlist. Please try again.',
        });
        setShowLeaveDialog(false);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again later.',
      });
      setShowLeaveDialog(false);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-md bg-[var(--background)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              You're About to Lose Priority Access
            </DialogTitle>
            <DialogDescription className="text-base pt-2 leading-relaxed">
              Over 500 people are waiting behind you for this spot. Leave now and you'll miss out on 7-day early access + 30 days free—worth $99. We're not reopening the waitlist once it fills. Still want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-4">
            <Button
              onClick={() => setShowLeaveDialog(false)}
              className="w-full h-11"
              size="lg"
            >
              Stay on Waitlist
            </Button>
            <Button
              onClick={handleLeaveWaitlist}
              disabled={isRemoving}
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--muted-foreground)] hover:bg-transparent h-auto p-2"
            >
              {isRemoving ? 'Removing...' : 'Leave anyway'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Headline */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          🚀 Get Early Access in ~7 Days + 30 Days Free
        </h1>
      </div>

      {/* Body Copy */}
      <div className="text-center space-y-4">
        <p className="text-base text-[var(--muted-foreground)] sm:text-lg leading-relaxed">
          We're onboarding users in small batches to ensure the best experience. Join the waitlist
          now to secure your spot and get <strong className="text-[var(--foreground)]">30 days completely free</strong> when
          your access unlocks.
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Limited spots available this week—don't miss your chance to be among the first.
        </p>
      </div>

      {/* Email Input (Readonly) */}
      <div className="space-y-2 text-center">
        <label
          htmlFor="email"
          className="text-sm font-medium text-[var(--foreground)] block"
        >
          Your Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          readOnly
          className="bg-[var(--muted)] cursor-not-allowed text-center"
        />
      </div>

      {/* CTA Button */}
      <div className="flex flex-col items-center gap-2">
        <ShinyButton
          onClick={handleJoinWaitlist}
          disabled={isLoading || isInWaitlist}
          className="w-full h-14 text-base font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInWaitlist ? "You're In! Check Your Email" : isLoading ? 'Joining...' : 'Claim My Free Access'}
        </ShinyButton>
        {isInWaitlist && (
          <p className="text-xs text-[var(--muted-foreground)]">
            Access granted in ~7 days • 30 days free •{' '}
            <button
              onClick={() => setShowLeaveDialog(true)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline underline-offset-2"
            >
              Cancel Spot
            </button>
          </p>
        )}
      </div>

      {/* Error Message Only */}
      {message && message.type === 'error' && (
        <div
          className="rounded-lg border p-4 text-sm bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200"
          role="alert"
        >
          <p className="font-medium">❌ Error</p>
          <p className="mt-1">{message.text}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          By joining the waitlist, you'll receive updates about your access and exclusive early-user benefits.
        </p>
      </div>
      </div>
    </>
  );
}
