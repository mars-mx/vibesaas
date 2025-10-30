import Script from "next/script";

interface StructuredDataProps {
  type?: "website" | "organization" | "softwareApplication" | "product";
}

export function StructuredData({ type = "website" }: StructuredDataProps) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VibeSaaS",
    url: "https://vibesaas.dev",
    logo: "https://vibesaas.dev/logo.png",
    description: "The only production-ready SaaS boilerplate that's actually free forever.",
    sameAs: [
      "https://x.com/marsc_hb",
      "https://github.com/mars-mx/vibesaas",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://vibesaas.dev",
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VibeSaaS",
    url: "https://vibesaas.dev",
    description: "Free SaaS boilerplate built with Next.js 15, React 19, TypeScript, Convex, and Tailwind CSS v4. Ship your SaaS product in days.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://vibesaas.dev/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VibeSaaS",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "100",
    },
    description: "Production-ready SaaS boilerplate with authentication, payments, and database. Built with Next.js 15, React 19, TypeScript, Convex, and Tailwind CSS v4.",
    creator: {
      "@type": "Organization",
      name: "VibeSaaS Team",
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vibesaas.dev",
      },
    ],
  };

  const getStructuredData = () => {
    switch (type) {
      case "organization":
        return organizationData;
      case "softwareApplication":
        return softwareApplicationData;
      case "product":
        return softwareApplicationData;
      default:
        return [websiteData, organizationData, breadcrumbData];
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
