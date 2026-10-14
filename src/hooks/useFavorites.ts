import { useEffect, useState } from "react";
import type { Property } from "../types/Property";
import { FAVORITES_KEY, favoriteKey, parseFavorites, toggleFavorite } from "../utils/favorites";

const SAME_TAB_EVENT = "listingview360:favorites-updated";
function read(): string[] {
  try { return parseFavorites(localStorage.getItem(FAVORITES_KEY)); }
  catch { return []; }
}
export function useFavorites() {
  const [keys, setKeys] = useState<string[]>(read);
  useEffect(() => {
    const reload = () => setKeys(read());
    window.addEventListener("storage", reload);
    window.addEventListener(SAME_TAB_EVENT, reload);
    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener(SAME_TAB_EVENT, reload);
    };
  }, []);
  function toggle(item: Property) {
    const next = toggleFavorite(read(), item);
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); }
    catch { /* storage disabled: still update in memory */ }
    setKeys(next);
    window.dispatchEvent(new Event(SAME_TAB_EVENT));
  }
  return {
    isFavorite: (item: Property) => keys.includes(favoriteKey(item)),
    toggleFavorite: toggle,
    count: keys.length,
  };
}
