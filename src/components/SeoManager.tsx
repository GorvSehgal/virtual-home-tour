import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { properties } from "../data/properties";
import { applyDynamicSeo } from "../utils/dynamicSeo";
import type { SeoConfig } from "../utils/dynamicSeo";

const SITE_NAME = "ListingView360";
const SITE_URL = "https://listingview360.ca";



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
  "/blog": {
    title: "Canadian Real Estate Guides & Insights | ListingView360",
    description: "Reviewed Canadian homebuyer tips, Ontario housing guides and real estate technology insights from ListingView360.",
    path: "/blog",
  },
  "/demo": {
    title: "Interactive 360° Demo Listings | ListingView360",
    description: "Explore fictional demonstration listings and sample 360° virtual tours. Demo homes are not available for sale or viewing.",
    path: "/demo",
    noIndex: true,
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
    noIndex: true,
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

function getSeoConfig(pathname: string): SeoConfig {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  const staticConfig = routeSeo[normalizedPath];

  if (staticConfig) {
    return staticConfig;
  }

  if (["/dashboard", "/signup", "/realtor/tools"].includes(normalizedPath)) {
    return {
      title: "Account | ListingView360",
      description: "Private account and realtor tools.",
      path: normalizedPath,
      noIndex: true,
    };
  }

  if (normalizedPath === "/admin/blog") {
    return {
      title: "Blog Administration | ListingView360",
      description: "Private administrator tools.",
      path: normalizedPath,
      noIndex: true,
    };
  }
  if (/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedPath)) {
    return {
      title: "Real Estate Insights | ListingView360",
      description: "Read real estate guides and insights on ListingView360.",
      path: normalizedPath,
    };
  }

  const demoMatch = normalizedPath.match(/^\/demo\/(\d+)$/);
  if (demoMatch) {
    const demoProperty = properties.find((item) => item.id === Number(demoMatch[1]));
    return {
      title: demoProperty ? `${demoProperty.title} — Fictional Demo | ListingView360` : "Demo Not Found | ListingView360",
      description: "Fictional real estate demonstration with a sample 360° virtual tour; not available for sale, rent, or viewing.",
      path: normalizedPath,
      noIndex: true,
    };
  }

  // Numeric API listing IDs may overlap local fictional demo IDs.
  // Keep detail routes out of the index until the approved API listing loads.
  const propertyMatch = normalizedPath.match(/^\/properties\/(\d+)$/);
  if (propertyMatch) {
    return {
      title: "Property Details | ListingView360",
      description: "Explore an approved Canadian property listing on ListingView360.",
      path: normalizedPath,
      noIndex: true,
    };
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
    applyDynamicSeo(getSeoConfig(pathname));
  }, [pathname]);

  return null;
}

export default SeoManager;
