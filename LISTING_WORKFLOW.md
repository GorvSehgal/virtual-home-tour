# Realtor image uploads and admin approval

The new `/dashboard` page replaces the old form at `/list-property` and requires login. Realtor accounts may upload up to 15 JPEG/PNG/WebP images (max 5 MB each), preview and reorder before submission, and edit their owned listings. Uploaded image URLs live on Cloudinary, never in browser-only state or Vercel's ephemeral disk.

A new listing is always pending. Editing resets approval status to pending, and only admin accounts have Approve or Reject/Unpublish controls. Public API endpoints only return approved records. Demo listings remain separately under /demo.

Back-end branch dependency: `GorvSehgal/listingview360-api` branch `feature/listing-approvals-image-upload` (includes authentication and AI branches).
Set `VITE_API_BASE_URL` to the deployed protected API base ending in /api/v1. Do not deploy frontend before backend migration and configuration. A realtor can sign in with their provisioned account, but uploading will fail until Cloudinary backend secrets are configured.

On first production migration, legacy properties intentionally become pending and need an admin's review. Verify real listing legitimacy and photo rights before approval.
