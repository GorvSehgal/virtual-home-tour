import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const output = join(process.cwd(), "dist");
const base = "https://listingview360.ca";
const pages = [
  ["properties", "Properties with 360° Virtual Tours in Canada"],
  ["for-realtors", "360° Real Estate Virtual Tours for Realtors"],
  ["blog", "Canadian Real Estate Guides & Insights"],
  ["contact", "Contact ListingView360"],
  ["privacy", "Privacy Policy"],
];

for (const [path, title] of pages) {
  const html = await readFile(join(output, path + ".html"), "utf8");
  assert.ok(html.includes("<title>" + title.replaceAll("&", "&amp;")), "Missing page title for " + path);
  assert.ok(html.includes('rel="canonical" href="' + base + "/" + path + '"'), "Wrong canonical for " + path);
  assert.ok(html.includes('property="og:url" content="' + base + "/" + path + '"'), "Wrong OG URL for " + path);
  assert.ok(html.includes('name="description"'), "Missing description for " + path);
}

const home = await readFile(join(output, "index.html"), "utf8");
assert.ok(home.includes('rel="canonical" href="' + base + '/"'), "Homepage canonical missing");
const app = await readFile(join(output, "app.html"), "utf8");
assert.doesNotMatch(app, /<link\s+rel="canonical"/i, "Fallback must not declare homepage canonical");
assert.doesNotMatch(app, /<meta\s+property="og:url"/i, "Fallback must not declare homepage OG URL");

const sitemap = await readFile(join(output, "sitemap.xml"), "utf8");
assert.ok(sitemap.includes("<loc>" + base + "/blog</loc>"), "Blog must appear in sitemap");
assert.ok(!sitemap.includes("<loc>" + base + "/list-property</loc>"), "Dashboard must not appear in sitemap");

const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
assert.equal(vercel.cleanUrls, true, "Clean URLs required for generated pages");
assert.ok(vercel.rewrites.some(route => route.destination === "/app.html"), "Missing SPA rewrite");
for (const path of ["/demo/:path*", "/admin/:path*", "/dashboard", "/signup", "/list-property"]) {
  const rule = vercel.headers.find(item => item.source === path);
  assert.ok(rule?.headers.some(header => header.key === "X-Robots-Tag" && header.value.includes("noindex")),
    "Missing noindex header for " + path);
}
console.log("SEO build assertions passed.");
