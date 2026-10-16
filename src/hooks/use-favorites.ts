import { useCallback, useSyncExternalStore } from "react";

import {
  getFavoritesSnapshot,
  getServerFavoritesSnapshot,
  subscribeToFavorites,
  toggleFavorite,
} from "@/lib/favorites";

/** Favoritos do dispositivo — sem conta, sem sincronização entre aparelhos. */
export const useFavorites = () => {
  const ids = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot,
  );

  const toggle = useCallback((productId: string) => toggleFavorite(productId), []);

  return {
    ids,
    count: ids.length,
    isFavorite: (productId: string) => ids.includes(productId),
    toggle,
  };
};
