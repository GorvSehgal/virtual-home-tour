export type RealtorSession = {
  accessToken: string;
  user: { id: number; email: string; role: "admin" | "realtor" };
};

export type DraftInput = {
  title: string;
  propertyType: string;
  city: string;
  province: string;
  bedrooms: number;
  bathrooms: number;
  price?: number;
  features: string[];
  tone: "professional" | "warm" | "luxury";
};

type Envelope<T> = { success: boolean; message?: string; data?: T };
const url = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
export const realtorApiConfigured = Boolean(url);

async function read<T>(response: Response): Promise<T> {
  let body: Envelope<T>;
  try {
    body = await response.json() as Envelope<T>;
  } catch {
    throw new Error("The server returned an invalid response.");
  }
  if (!response.ok || !body.success || body.data === undefined) {
    throw new Error(body.message ?? `Request failed with status ${response.status}.`);
  }
  return body.data;
}

export async function realtorLogin(email: string, password: string): Promise<RealtorSession> {
  if (!url) throw new Error("The property API has not been configured.");
  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await read<RealtorSession>(response);
  if (!result.accessToken || !result.user) throw new Error("Invalid login response.");
  return result;
}

export async function draftDescription(
  token: string, fields: DraftInput,
): Promise<{ draft: string; model: string; needsReview: boolean }> {
  if (!url) throw new Error("The property API has not been configured.");
  const response = await fetch(`${url}/ai/listing-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });
  const result = await read<{ draft: string; model: string; needsReview: boolean }>(response);
  if (typeof result.draft !== "string" || result.needsReview !== true) {
    throw new Error("The server returned an invalid draft.");
  }
  return result;
}
