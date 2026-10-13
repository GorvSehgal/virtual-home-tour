import type { RealtorSession } from "./realtorApi";

export type ListingStatus = "pending" | "approved" | "rejected";
export type ManagedListing = {
  id: number; status: ListingStatus; ownerId?: number;
  title: string; address: string; city: string; province: string; postalCode: string;
  listingType: "sale" | "rent"; price: number; bedrooms: number; bathrooms: number;
  propertyType: string; yearBuilt?: number; description: string;
  realtorName: string; realtorBrokerage?: string;
  images: string[]; panoramas: Array<{ name: string; url: string }>;
};
export type SaveListing = Omit<ManagedListing, "id" | "status" | "ownerId">;
const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

async function request<T>(session: RealtorSession, endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!base) throw new Error("The property API is not configured.");
  const response = await fetch(`${base}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}`, ...options.headers },
  });
  let json: { success?: boolean; data?: T; message?: string };
  try { json = await response.json() as typeof json; }
  catch { throw new Error("The server returned an invalid response."); }
  if (!response.ok || json.success !== true || json.data === undefined) {
    throw new Error(json.message ?? `Request failed (HTTP ${response.status}).`);
  }
  return json.data;
}
export function listManaged(session: RealtorSession): Promise<ManagedListing[]> {
  return request<ManagedListing[]>(session, "/properties/manage");
}
export function saveListing(session: RealtorSession, data: SaveListing, id?: number): Promise<ManagedListing> {
  return request<ManagedListing>(session, id ? `/properties/${id}` : "/properties", {
    method: id ? "PATCH" : "POST", body: JSON.stringify(data),
  });
}
export function reviewListing(session: RealtorSession, id: number, status: "approved" | "rejected"): Promise<ManagedListing> {
  if (session.user.role !== "admin") throw new Error("Only an administrator can review listings.");
  return request<ManagedListing>(session, `/properties/${id}/review`, {
    method: "PATCH", body: JSON.stringify({ status }),
  });
}
function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unable to read the photo."));
    reader.onerror = () => reject(new Error("Unable to read the photo."));
    reader.readAsDataURL(file);
  });
}
export async function uploadPhoto(session: RealtorSession, file: File): Promise<string> {
  if (file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error(`${file.name} exceeds the 5 MB limit or is empty.`);
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error(`${file.name} must be JPEG, PNG or WebP.`);
  const dataUrl = await toDataUrl(file);
  const response = await request<{ url: string }>(session, "/uploads/images", {
    method: "POST", body: JSON.stringify({ dataUrl }),
  });
  if (!response.url?.startsWith("https://")) throw new Error("Upload returned an invalid image URL.");
  return response.url;
}
