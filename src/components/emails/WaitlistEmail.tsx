/**
 * Waitlist Confirmation Email Template
 * Sent when user joins the waitlist
 */

import * as React from 'react';
import type { WaitlistEmailData } from '@/lib/email/types';

export function WaitlistEmail({
  firstName,
  email,
  position,
  referralUrl,
}: WaitlistEmailData) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not set');
  }
  if (!process.env.RESEND_FROM_NAME) {
    throw new Error('RESEND_FROM_NAME is not set');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const appName = process.env.RESEND_FROM_NAME;

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' as const, marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
          }}
        >
          🎉 You're on the list!
        </div>

        <h1
          style={{
            color: '#000000',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
          }}
        >
          Welcome to the Waitlist
        </h1>

        {position && (
          <p
            style={{
              color: '#666666',
              fontSize: '18px',
              margin: '0',
            }}
          >
            You're #{position} in line
          </p>
        )}
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '32px' }}>
        <p
          style={{
            color: '#333333',
            fontSize: '16px',
            lineHeight: '24px',
            margin: '0 0 16px 0',
          }}
        >
          Hi {firstName},
        </p>

        <p
          style={{
            color: '#333333',
            fontSize: '16px',
            lineHeight: '24px',
            margin: '0 0 16px 0',
          }}
        >
          Thanks for joining the {appName} waitlist with <strong>{email}</strong>!
        </p>

        <p
          style={{
            color: '#333333',
            fontSize: '16px',
            lineHeight: '24px',
            margin: '0 0 16px 0',
          }}
        >
          We're working hard to bring you something special, and we can't wait to
          share it with you. You'll be among the first to know when we launch.
        </p>
      </div>

      {/* Referral Section (if referral URL provided) */}
      {referralUrl && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              color: '#000000',
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 12px 0',
            }}
          >
            Move up the list! 🚀
          </h2>

          <p
            style={{
              color: '#333333',
              fontSize: '15px',
              lineHeight: '22px',
              margin: '0 0 16px 0',
            }}
          >
            Share your unique referral link with friends. For every person who
            joins using your link, you'll move up the waitlist.
          </p>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              wordBreak: 'break-all' as const,
            }}
          >
            <code
              style={{
                color: '#666666',
                fontSize: '14px',
              }}
            >
              {referralUrl}
            </code>
          </div>

          <a
            href={referralUrl}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#000000',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
            }}
          >
            Copy Referral Link
          </a>
        </div>
      )}

      {/* What to Expect */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '32px',
          borderTop: '1px solid #e5e5e5',
        }}
      >
        <h2
          style={{
            color: '#000000',
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 16px 0',
          }}
        >
          What happens next?
        </h2>

        <ul
          style={{
            color: '#333333',
            fontSize: '15px',
            lineHeight: '24px',
            margin: '0',
            padding: '0 0 0 20px',
          }}
        >
          <li style={{ marginBottom: '8px' }}>
            We'll send you updates as we get closer to launch
          </li>
          <li style={{ marginBottom: '8px' }}>
            You'll get early access when we're ready
          </li>
          <li style={{ marginBottom: '8px' }}>
            Exclusive perks for being an early supporter
          </li>
        </ul>
      </div>

      {/* Social Links */}
      <div
        style={{
          marginTop: '32px',
          textAlign: 'center' as const,
        }}
      >
        <p
          style={{
            color: '#666666',
            fontSize: '15px',
            margin: '0 0 16px 0',
          }}
        >
          Follow us for updates:
        </p>

        <div style={{ marginBottom: '16px' }}>
          {/* Add your social media links here */}
          <a
            href={appUrl}
            style={{
              color: '#000000',
              textDecoration: 'none',
              margin: '0 8px',
              fontSize: '14px',
            }}
          >
            Website
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '40px',
          paddingTop: '32px',
          borderTop: '1px solid #e5e5e5',
          textAlign: 'center' as const,
        }}
      >
        <p
          style={{
            color: '#999999',
            fontSize: '14px',
            lineHeight: '20px',
            margin: '0 0 8px 0',
          }}
        >
          Stay tuned! We'll be in touch soon.
        </p>

        <p
          style={{
            color: '#999999',
            fontSize: '12px',
            margin: '0',
          }}
        >
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
