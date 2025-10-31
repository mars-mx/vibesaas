/**
 * Welcome Email Template
 * Sent after user signs up for the first time
 */

import * as React from 'react';
import type { WelcomeEmailData } from '@/lib/email/types';

export function WelcomeEmail({ firstName, email }: WelcomeEmailData) {
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
        <h1
          style={{
            color: '#000000',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
          }}
        >
          Welcome to {appName}!
        </h1>
        <p
          style={{
            color: '#666666',
            fontSize: '16px',
            margin: '0',
          }}
        >
          We're excited to have you on board, {firstName}
        </p>
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
          Thanks for signing up with <strong>{email}</strong>
        </p>

        <p
          style={{
            color: '#333333',
            fontSize: '16px',
            lineHeight: '24px',
            margin: '0 0 16px 0',
          }}
        >
          You're all set! Click the button below to get started and explore
          everything {appName} has to offer.
        </p>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center' as const, margin: '32px 0' }}>
        <a
          href={`${appUrl}/dashboard`}
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            backgroundColor: '#000000',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Get Started
        </a>
      </div>

      {/* Features Section */}
      <div
        style={{
          marginTop: '40px',
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
          What's next?
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
            Complete your profile settings
          </li>
          <li style={{ marginBottom: '8px' }}>
            Explore the dashboard and features
          </li>
          <li style={{ marginBottom: '8px' }}>
            Check out our documentation and guides
          </li>
        </ul>
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
          Need help? Reply to this email or visit our support center.
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
