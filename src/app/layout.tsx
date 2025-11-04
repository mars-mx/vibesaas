import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClerkProvider } from "@/components/providers/convex-clerk-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const interMono = Inter({
  variable: "--font-mono-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vibesaas.dev"),
  title: {
    default: "VibeSaaS - Free SaaS Boilerplate | Ship in Days, Not Months",
    template: "%s | VibeSaaS",
  },
  description: "The only production-ready SaaS boilerplate that's actually free forever. Built with Next.js 15, React 19, TypeScript, Convex, and Tailwind CSS v4. Ship your SaaS product in days with authentication, payments, and database included.",
  keywords: [
    // Primary Keywords
    "SaaS boilerplate",
    "free SaaS template",
    "Next.js 15 boilerplate",
    "React 19 starter",
    "TypeScript SaaS template",
    // Technology Stack
    "Next.js SaaS starter",
    "Convex backend",
    "Tailwind CSS v4",
    "Clerk authentication",
    "Polar payments",
    // Use Cases
    "startup boilerplate",
    "MVP template",
    "production-ready SaaS",
    "full-stack starter kit",
    // Features
    "SaaS authentication",
    "payment integration template",
    "subscription management boilerplate",
    "database included",
    // Alternatives
    "free alternative to paid boilerplates",
    "open source SaaS starter",
    "modern web app template",
    "enterprise-ready boilerplate",
  ],
  authors: [{ name: "VibeSaaS Team", url: "https://vibesaas.dev" }],
  creator: "VibeSaaS",
  publisher: "VibeSaaS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibesaas.dev",
    siteName: "VibeSaaS",
    title: "VibeSaaS - Free SaaS Boilerplate | Ship in Days, Not Months",
    description: "The only production-ready SaaS boilerplate that's actually free forever. Build with Next.js 15, React 19, TypeScript, Convex & Tailwind CSS v4.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeSaaS - Free Forever SaaS Boilerplate with Next.js 15, React 19, and TypeScript",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@marsc_hb",
    creator: "@marsc_hb",
    title: "VibeSaaS - Free SaaS Boilerplate | Ship in Days, Not Months",
    description: "The only production-ready boilerplate that doesn't cost a fortune. Built with Next.js 15, React 19, TypeScript, Convex & Tailwind CSS v4.",
    images: [
      {
        url: "/twitter-image.png",
        alt: "VibeSaaS - Free Forever SaaS Boilerplate",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vibesaas.dev",
    languages: {
      "en-US": "https://vibesaas.dev",
    },
  },
  category: "technology",
  classification: "Software Development Tools",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <StructuredData />
        </head>
        <body
          className={`${inter.variable} ${interMono.variable} antialiased`}
        >
          <ConvexClerkProvider>
            <PostHogProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md"
              >
                Skip to main content
              </a>
              <main id="main-content">
                {children}
              </main>
            </PostHogProvider>
          </ConvexClerkProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
