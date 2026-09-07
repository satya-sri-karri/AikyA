import { useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext.jsx";

const FAV_KEY = "aikya_favorites";
const RECENT_KEY = "aikya_recents";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => read(FAV_KEY, []));
  const [recents, setRecents] = useState(() => read(RECENT_KEY, []));
  const { toast } = useToast() || {};

  useEffect(() => write(FAV_KEY, favorites), [favorites]);
  useEffect(() => write(RECENT_KEY, recents), [recents]);

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f._id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (poi) => {
      const isFav = favorites.some((f) => f._id === poi._id);
      setFavorites((prev) =>
        isFav ? prev.filter((f) => f._id !== poi._id) : [poi, ...prev].slice(0, 24)
      );
      toast?.(isFav ? `Removed ${poi.name} from favorites` : `Saved ${poi.name} to favorites`, isFav ? "info" : "success");
    },
    [favorites, toast]
  );

  const recordVisit = useCallback((poi) => {
    if (!poi?._id) return;
    setRecents((prev) => [
      { _id: poi._id, name: poi.name, type: poi.type, block: poi.block, latitude: poi.latitude, longitude: poi.longitude, description: poi.description },
      ...prev.filter((r) => r._id !== poi._id),
    ].slice(0, 8));
  }, []);

  const clearRecents = useCallback(() => setRecents([]), []);

  return { favorites, recents, isFavorite, toggleFavorite, recordVisit, clearRecents };
}