import fallbackImage from "../assets/properties/toronto-condo.jpg";
import { properties as demoProperties } from "../data/properties";
import type { Property } from "../types/Property";

type ApiProperty = {
  id: number;
  title: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  yearBuilt?: number | null;
  description: string;
  images: string[];
  panoramas: Property["panoramas"];
};

type ApiResponse<T> = { success: boolean; data: T };

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
export const isApiConfigured = Boolean(apiBaseUrl);

function toProperty(property: ApiProperty): Property {
  return {
    id: property.id,
    title: property.title,
    address: property.address,
    city: property.city,
    province: property.province,
    postalCode: property.postalCode,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    propertyType: property.propertyType,
    yearBuilt: property.yearBuilt ?? undefined,
    image: property.images?.[0] || fallbackImage,
    images: property.images?.length ? property.images : [fallbackImage],
    description: property.description,
    panoramas: property.panoramas ?? [],
    // The current API seed includes example inventory. Do not present it as verified MLS data.
    dataSource: "ListingView360 — administrator-approved listing",
    isDemo: false,
  };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`Property service returned HTTP ${response.status}.`);
  const result: ApiResponse<T> = await response.json();
  if (!result || result.success !== true || !("data" in result)) {
    throw new Error("Invalid response from property service.");
  }
  return result.data;
}

/** Uses built-in demonstration listings until a VITE_API_BASE_URL is configured. */
export async function fetchProperties(signal: AbortSignal): Promise<Property[]> {
  if (!apiBaseUrl) return demoProperties;
  const response = await fetch(`${apiBaseUrl}/properties`, { signal });
  const data = await parseApiResponse<ApiProperty[]>(response);
  if (!Array.isArray(data)) throw new Error("The property service returned an invalid list.");
  return data.map(toProperty);
}

export async function fetchPropertyById(id: number, signal: AbortSignal): Promise<Property | null> {
  if (!apiBaseUrl) return demoProperties.find((item) => item.id === id) ?? null;
  const response = await fetch(`${apiBaseUrl}/properties/${id}`, { signal });
  if (response.status === 404) return null;
  const data = await parseApiResponse<ApiProperty>(response);
  if (!data || typeof data.id !== "number") {
    throw new Error("The property service returned an invalid property.");
  }
  return toProperty(data);
}
