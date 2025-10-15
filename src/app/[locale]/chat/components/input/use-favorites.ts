import { useCallback, useEffect, useState } from "react";

/**
 * Hook for managing favorites in localStorage
 * @param storageKey - The localStorage key to use
 * @param defaultFavorites - Default favorites to use if none are stored
 * @returns Tuple of [favorites, toggleFavorite, setFavorites]
 */
export function useFavorites<T extends string>(
  storageKey: string,
  defaultFavorites: T[],
): [T[], (id: T) => void, (favorites: T[]) => void] {
  const [favorites, setFavoritesState] = useState<T[]>(defaultFavorites);
  const [mounted, setMounted] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as T[];
        setFavoritesState(parsed);
      } catch (error) {
        console.error(`Failed to load favorites from ${storageKey}:`, error);
      }
    }
  }, [storageKey]);

  // Save favorites to localStorage
  const setFavorites = useCallback(
    (newFavorites: T[]) => {
      setFavoritesState(newFavorites);
      if (mounted) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newFavorites));
        } catch (error) {
          console.error(`Failed to save favorites to ${storageKey}:`, error);
        }
      }
    },
    [storageKey, mounted],
  );

  // Toggle a favorite
  const toggleFavorite = useCallback(
    (id: T) => {
      const newFavorites = favorites.includes(id)
        ? favorites.filter((favId) => favId !== id)
        : [...favorites, id];
      setFavorites(newFavorites);
    },
    [favorites, setFavorites],
  );

  return [favorites, toggleFavorite, setFavorites];
}
