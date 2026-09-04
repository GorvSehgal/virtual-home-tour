import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { properties } from "../data/properties";

const SITE_NAME = "ListingView360";
const SITE_URL = "https://listingview360.ca";

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  structuredData?: Record<string, unknown>;
};

const routeSeo: Record<string, SeoConfig> = {
  "/": {
    title: "360° Virtual Property Tours for Canadian Realtors | ListingView360",
    description:
      "Create and explore immersive 360° real estate tours with ListingView360. Built for Canadian Realtors who want stronger property marketing and qualified viewing requests.",
    path: "/",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.png`,
          email: "listingview360@gmail.com",
          areaServed: "Canada",
        },
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          publisher: {
            "@id": `${SITE_URL}/#organization`,
          },
          inLanguage: "en-CA",
        },
      ],
    },
  },
  "/properties": {
    title: "Properties with 360° Virtual Tours in Canada | ListingView360",
    description:
      "Browse Canadian property listings with immersive 360° virtual tours and request in-person viewings directly from each property page.",
    path: "/properties",
  },
  "/for-realtors": {
    title: "360° Real Estate Virtual Tours for Realtors | ListingView360",
    description:
      "Help your real estate listings stand out with immersive 360° tours, shareable property pages, and direct buyer viewing requests.",
    path: "/for-realtors",
  },
  "/list-property": {
    title: "List a Property with a 360° Virtual Tour | ListingView360",
    description:
      "Submit your Canadian property listing to ListingView360 and create an immersive virtual-tour experience designed to engage serious buyers.",
    path: "/list-property",
  },
  "/contact": {
    title: "Contact ListingView360 | 360° Real Estate Tours",
    description:
      "Contact ListingView360 about 360° property tours, Realtor partnerships, listing submissions, demos, or support.",
    path: "/contact",
  },
  "/privacy": {
    title: "Privacy Policy | ListingView360",
    description:
      "Read the ListingView360 privacy policy and learn how information submitted through property, contact, and viewing forms is handled.",
    path: "/privacy",
  },
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

function setStructuredData(data?: Record<string, unknown>) {
  const existing = document.head.querySelector(
    'script[data-listingview360-seo="structured-data"]'
  );

  existing?.remove();

  if (!data) {
    return;
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.listingview360Seo = "structured-data";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function getSeoConfig(pathname: string): SeoConfig {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  const staticConfig = routeSeo[normalizedPath];

  if (staticConfig) {
    return staticConfig;
  }

  const propertyMatch = normalizedPath.match(/^\/properties\/(\d+)$/);

  if (propertyMatch) {
    const property = properties.find(
      (item) => item.id === Number(propertyMatch[1])
    );

    if (property) {
      return {
        title: `${property.title} in ${property.city}, ${property.province} | ListingView360`,
        description: `${property.description} Explore the property with a 360° virtual tour and request an in-person viewing.`,
        path: normalizedPath,
        noIndex: property.isDemo,
        image: property.image,
      };
    }
  }

  return {
    title: "Page Not Found | ListingView360",
    description: "The page you requested could not be found.",
    path: normalizedPath,
    noIndex: true,
  };
}

function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const config = getSeoConfig(pathname);
    const canonicalUrl = new URL(config.path, SITE_URL).toString();
    const robots = config.noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large";

    document.title = config.title;
    document.documentElement.lang = "en-CA";

    upsertMeta("name", "description", config.description);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:title", config.title);
    upsertMeta("property", "og:description", config.description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", "website");
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", config.title);
    upsertMeta("name", "twitter:description", config.description);

    if (config.image) {
      const imageUrl = new URL(config.image, SITE_URL).toString();
      upsertMeta("property", "og:image", imageUrl);
      upsertMeta("name", "twitter:image", imageUrl);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }

    upsertCanonical(canonicalUrl);
    setStructuredData(config.structuredData);
  }, [pathname]);

  return null;
}

export default SeoManager;
