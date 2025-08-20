export const siteConfig = {
  name: "VibeSaaS",
  description: "The only SaaS boilerplate that's actually free forever. No catch, no limits, just vibes.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://vibesaas.com",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/mars-mx/vibesaas",
    twitter: "https://x.com/marsc_hb",
  },
} as const;