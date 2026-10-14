// Public, unauthenticated smoke test for the live ListingView360 release.
// Node 22+; no API keys, passwords, paid tools, or third-party dependencies.
import assert from "node:assert/strict";

const site = "https://listingview360.ca";
const api = "https://listingview360-api-staging.onrender.com/api/v1";

async function check(label, url, status, kind) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(60000),
        headers: { "User-Agent": "ListingView360-GitHub-CI-SmokeTest/1" },
      });
      assert.equal(response.status, status, `${label}: HTTP ${response.status}, expected ${status}`);
      if (kind === "json") {
        const data = await response.json();
        assert.equal(data.success, true, `${label}: expected successful JSON envelope`);
        assert.ok(Array.isArray(data.data), `${label}: expected article array`);
      } else if (kind === "html") {
        const contentType = response.headers.get("content-type") || "";
        assert.match(contentType, /text\/html/i, `${label}: expected HTML`);
        const html = await response.text();
        assert.match(html, /<div id="root">/i, `${label}: expected React entry point`);
      }
      console.log(`PASS ${label}: HTTP ${status}`);
      return;
    } catch (err) {
      lastError = err;
      console.warn(`Attempt ${attempt} failed for ${label}: ${err instanceof Error ? err.message : err}`);
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  throw new Error(`${label} failed: ${lastError instanceof Error ? lastError.message : lastError}`);
}

await check("API health", `${api}/health`, 200);
await check("Public blog API", `${api}/blog`, 200, "json");
await check("Admin blog requires login", `${api}/blog/manage`, 401);
await check("Unpublished or unknown article inaccessible", `${api}/blog/ci-unpublished-smoke-check-999999`, 404);
await check("Public /blog route", `${site}/blog`, 200, "html");
await check("Admin /admin/blog route", `${site}/admin/blog`, 200, "html");
