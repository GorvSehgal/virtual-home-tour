export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  structuredData?: Record<string, unknown>;
};

const SITE_NAME = "ListingView360";
const SITE_URL = "https://listingview360.ca";

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

export function applyDynamicSeo(config: SeoConfig) {
  applySeoConfig(config);
}

function applySeoConfig(config: SeoConfig) {
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
}

