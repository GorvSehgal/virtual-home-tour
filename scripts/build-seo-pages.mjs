/**
 * Generate crawlable, route-specific HTML shells at build time.
 * Vercel cleanUrls maps /blog to blog.html before the SPA rewrite fallback.
 * Articles and approved property details still need server rendering if social
 * bots must display their dynamic content without running JavaScript.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const origin = "https://listingview360.ca";
const out = join(process.cwd(), "dist");
const template = await readFile(join(out, "index.html"), "utf8");

const routes = [
  {
    path: "/properties",
    title: "Properties with 360° Virtual Tours in Canada | ListingView360",
    description: "Browse Canadian property listings with immersive 360° virtual tours and request in-person viewings directly from each property page.",
  },
  {
    path: "/for-realtors",
    title: "360° Real Estate Virtual Tours for Realtors | ListingView360",
    description: "Help your real estate listings stand out with immersive 360° tours, shareable property pages, and direct buyer viewing requests.",
  },
  {
    path: "/blog",
    title: "Canadian Real Estate Guides & Insights | ListingView360",
    description: "Reviewed Canadian homebuyer tips, Ontario housing guides and real estate technology insights from ListingView360.",
  },
  {
    path: "/contact",
    title: "Contact ListingView360 | 360° Real Estate Tours",
    description: "Contact ListingView360 about 360° property tours, Realtor partnerships, listing submissions, demos, or support.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | ListingView360",
    description: "Read the ListingView360 privacy policy and learn how information submitted through property, contact, and viewing forms is handled.",
  },
];

const encode = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function upsertMeta(html, attribute, key, value) {
  const matcher = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${encode(value)}" />`;
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceTitle(html, title) {
  if (!/<title>[^<]*<\/title>/i.test(html)) {
    throw new Error("Could not find an HTML page title");
  }
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${encode(title)}</title>`);
}

function replaceCanonical(html, path) {
  const canonical = `<link rel="canonical" href="${origin}${path}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    return html.replace(/<link\s+rel="canonical"[^>]*>/i, canonical);
  }
  return html.replace("</head>", `    ${canonical}\n  </head>`);
}

// Dynamic routes must not inherit the homepage canonical from index.html.
// Their canonical is assigned by SeoManager after React resolves the URL.
const fallbackHtml = template
  .replace(/<link\s+rel="canonical"[^>]*>/i, "")
  .replace(/<meta\s+property="og:url"[^>]*>/i, "");
await writeFile(join(out, "app.html"), fallbackHtml);

for (const route of routes) {
  let html = replaceTitle(template, route.title);
  html = replaceCanonical(html, route.path);
  html = upsertMeta(html, "name", "description", route.description);
  html = upsertMeta(html, "property", "og:title", route.title);
  html = upsertMeta(html, "property", "og:description", route.description);
  html = upsertMeta(html, "property", "og:url", origin + route.path);
  html = upsertMeta(html, "name", "twitter:title", route.title);
  html = upsertMeta(html, "name", "twitter:description", route.description);
  await writeFile(join(out, route.path.slice(1) + ".html"), html);
}
console.log(`Generated ${routes.length} route-specific SEO HTML pages.`);
