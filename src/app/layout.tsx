import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClerkProvider } from "@/components/providers/convex-clerk-provider";
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
  title: {
    default: "VibeSaaS - Free SaaS Boilerplate | Ship in Days, Not Months",
    template: "%s | VibeSaaS",
  },
  description: "The only production-ready SaaS boilerplate that's actually free forever. Built with Next.js 15, React 19, TypeScript, Convex, and Tailwind CSS v4.",
  keywords: ["SaaS boilerplate", "Next.js template", "React starter", "free boilerplate", "TypeScript", "Convex", "Tailwind CSS"],
  authors: [{ name: "VibeSaaS Team" }],
  creator: "VibeSaaS",
  publisher: "VibeSaaS",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibesaas.com",
    siteName: "VibeSaaS",
    title: "VibeSaaS - Free SaaS Boilerplate",
    description: "Ship your SaaS in days, not months. For $0.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "VibeSaaS - Free Forever SaaS Boilerplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeSaaS - Free SaaS Boilerplate",
    description: "The only production-ready boilerplate that doesn't cost a fortune.",
    images: ["/og.png"],
    creator: "@vibesaas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <body
          className={`${inter.variable} ${interMono.variable} antialiased`}
        >
          <ConvexClerkProvider>
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md"
            >
              Skip to main content
            </a>
            <main id="main-content">
              {children}
            </main>
          </ConvexClerkProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
