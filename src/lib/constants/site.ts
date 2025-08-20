export const siteConfig = {
  name: "VibeSaaS",
  description: "The only SaaS boilerplate that's actually free forever. No catch, no limits, just vibes.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://vibesaas.com",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/yourusername/vibesaas",
    twitter: "https://twitter.com/vibesaas",
    discord: "https://discord.gg/vibesaas",
  },
} as const;