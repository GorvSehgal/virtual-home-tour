/** Saved listings are local to this browser, not synced to accounts. */
export type FavoriteIdentity = { id: number; isDemo: boolean };
export const FAVORITES_KEY = "listingview360:favorites:v1";

export function favoriteKey(item: FavoriteIdentity): string {
  return `${item.isDemo ? "demo" : "real"}:${item.id}`;
}

export function parseFavorites(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((key): key is string =>
      typeof key === "string" && /^(real|demo):[1-9]\d*$/.test(key)))].slice(0, 500);
  } catch { return []; }
}

export function toggleFavorite(keys: string[], identity: FavoriteIdentity): string[] {
  const key = favoriteKey(identity);
  return keys.includes(key) ? keys.filter(value => value !== key) : [...keys, key].slice(-500);
}

export function pageCount(total: number, size: number): number {
  return size > 0 ? Math.max(1, Math.ceil(Math.max(0, total) / size)) : 1;
}
export function pageSlice<T>(items: T[], page: number, size: number): T[] {
  const safeSize = Math.max(1, Math.trunc(size) || 1);
  const safePage = Math.min(Math.max(1, Math.trunc(page) || 1), pageCount(items.length, safeSize));
  return items.slice((safePage - 1) * safeSize, safePage * safeSize);
}
