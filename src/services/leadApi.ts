import type { RealtorSession } from "./realtorApi";
const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
export type ViewingLead = {
  id: number; propertyId: number; name: string; email: string; phone: string;
  preferredDate: string; message?: string | null; status: "new" | "contacted" | "closed";
  createdAt: string; property: { title: string; city: string };
};
export type PropertyInsight = {
  propertyId: number; views: number; tourStarts: number;
  property: { title: string; city: string; status: string };
};
async function get<T>(session: RealtorSession, path: string, options?: RequestInit): Promise<T> {
  if (!base) throw new Error("API not configured");
  const response = await fetch(base+path, {
    ...options,
    headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json", ...options?.headers },
  });
  const body=await response.json() as {success?:boolean;data?:T;message?:string};
  if(!response.ok || !body.success || body.data===undefined)throw new Error(body.message || "Request failed");
  return body.data;
}
export const listViewingLeads = (session: RealtorSession) => get<ViewingLead[]>(session, "/viewing-requests");
export const listPropertyInsights = (session: RealtorSession) => get<PropertyInsight[]>(session, "/listing-insights");
export const updateLead = (session: RealtorSession, id: number, status: ViewingLead["status"]) =>
  get<{id:number;status:string}>(session, `/viewing-requests/${id}`, {method:"PATCH",body:JSON.stringify({status})});
