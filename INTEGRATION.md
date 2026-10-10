# ListingView360 API integration

The React application can now load property search results, featured listings, and property details from the existing ListingView360 Express/PostgreSQL API.

## Local setup

1. Run the separate `listingview360-api` repository with a configured PostgreSQL `DATABASE_URL` and migrations.
2. Copy `.env.example` to `.env.local` in this frontend project.
3. Set `VITE_API_BASE_URL=http://localhost:3000/api/v1`. The suffix `/api/v1` is required.
4. Run `npm ci && npm run dev` in the frontend.
5. Verify `GET /api/v1/properties` and `GET /api/v1/properties/:id` are reachable from the browser.

Without `VITE_API_BASE_URL`, the existing static demonstration properties are displayed. If the API is configured but unreachable, the app shows an error instead of silently pretending the fallback inventory is live.

## Data mapping

The backend stores multiple `images` and `panoramas` per property; the current property card uses the first image as its cover. Properties lacking panoramas display a placeholder message instead of an empty tour viewer. City and property-type filters derive their options from the loaded records.

**Important:** The current backend seed populates fictional sample listings. API entries remain labelled unverified/demo until an authenticated, licensed inventory source and explicit demo/live flag are in place. Do not market them as actual properties available for sale or rent.

## Next engineering priorities

- Protect backend POST/PATCH/DELETE routes with authorization before deploying the API publicly. At present they are unauthenticated.
- Add server-side filtering, pagination, caching, and request validation for large inventories.
- Build realtor/admin authentication with role-based access and audit history.
- Add AI-assisted property description drafting and extracted listing metadata with human review, not automatic unreviewed publishing.
- Add analytics using real consent-compliant interaction events.
- Set `VITE_API_BASE_URL` in Vercel deployment settings once the backend has a stable HTTPS URL and a properly restricted CORS policy.

## Realtor AI Tools

The `/realtor/tools` page lets administrators and trusted realtor accounts sign in and draft property descriptions using the protected backend AI endpoint. It is not a public signup route.

- Requires the authentication backend PR and its dependent AI drafting PR to be deployed.
- Keep the Gemini key on the **backend only**. Set `GEMINI_API_KEY` and an available `GEMINI_MODEL` in the API's secure environment, not the frontend.
- The page holds access tokens only in React component memory. Refreshing the page requires signing in again; no localStorage or URL tokens are used.
- AI drafts are always human-reviewed and are never saved automatically.
- If `VITE_API_BASE_URL` is missing or the backend is unavailable, a clear error appears instead of a false success.
