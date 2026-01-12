/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS } from "@/app/api/[locale]/agent/chat/constants";
import {
  ContentLevelFilter,
  IntelligenceLevelFilter,
  ModelSelectionType,
  PriceLevelFilter,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import favoriteByIdDefinition, {
  type FavoriteUpdateRequestOutput,
} from "./[id]/definition";
import type { FavoriteItem } from "./components/favorites-bar";
import favoritesDefinition from "./definition";

/**
 * Load favorites from localStorage
 */
function loadLocalFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_CHARACTERS);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    // Handle legacy format (array of character IDs)
    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed.map((characterId: string, index: number) => ({
        id: `local-${characterId}`,
        characterId,
        modelSettings: {
          mode: ModelSelectionMode.AUTO,
          filters: {
            intelligence: IntelligenceLevelFilter.SMART,
            maxPrice: PriceLevelFilter.STANDARD,
            content: ContentLevelFilter.OPEN,
          },
        },
        isActive: index === 0,
      }));
    }
    // New format
    return parsed as FavoriteItem[];
  } catch {
    return [];
  }
}

/**
 * Save favorites to localStorage
 */
function saveLocalFavorites(favorites: FavoriteItem[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(
    STORAGE_KEYS.FAVORITE_CHARACTERS,
    JSON.stringify(favorites),
  );
}

interface UseChatFavoritesOptions {
  user: JwtPayloadType | undefined;
  logger: EndpointLogger;
}

interface UseChatFavoritesReturn {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  setFavorites: (favorites: FavoriteItem[]) => void;
  addFavorite: (favorite: Omit<FavoriteItem, "id">) => Promise<FavoriteItem>;
  updateFavorite: (
    id: string,
    updates: FavoriteUpdateRequestOutput,
  ) => Promise<void>;
  deleteFavorite: (id: string) => Promise<void>;
  refetch: () => void;
}

/**
 * Hook for managing chat favorites
 * - Authenticated users: server storage only
 * - Non-authenticated users: localStorage only
 */
export function useChatFavorites({
  user,
  logger,
}: UseChatFavoritesOptions): UseChatFavoritesReturn {
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  // Use server storage only for authenticated users
  const useServerStorage = isAuthenticated;

  // Local state for favorites
  const [favorites, setFavoritesState] = useState<FavoriteItem[]>(() =>
    useServerStorage ? [] : loadLocalFavorites(),
  );
  const [isLoading, setIsLoading] = useState(useServerStorage);

  // Server endpoint - always call useEndpoint (rules of hooks)
  const endpoint = useEndpoint(
    favoritesDefinition,
    {
      queryOptions: {
        enabled: useServerStorage,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
      },
    },
    logger,
  );

  // Mutations for individual favorite operations (PATCH/DELETE)
  const patchMutation = useApiMutation(favoriteByIdDefinition.PATCH, logger);
  const deleteMutation = useApiMutation(favoriteByIdDefinition.DELETE, logger);

  // Sync server data to local state when using server storage
  useEffect(() => {
    if (useServerStorage) {
      if (
        endpoint.read?.response &&
        "success" in endpoint.read.response &&
        endpoint.read.response.success === true &&
        "data" in endpoint.read.response &&
        endpoint.read.response.data &&
        "favorites" in endpoint.read.response.data
      ) {
        const serverFavorites = endpoint.read.response.data.favorites;
        setFavoritesState(serverFavorites);
        setIsLoading(false);
      } else if (endpoint.read?.status === "error") {
        // Server error - keep empty state, don't fallback to local
        setIsLoading(false);
      }
    } else {
      // For non-authenticated users, load from localStorage
      setFavoritesState(loadLocalFavorites());
      setIsLoading(false);
    }
  }, [useServerStorage, endpoint.read?.response, endpoint.read?.status]);

  // Set favorites - saves to appropriate storage
  const setFavorites = useCallback(
    (newFavorites: FavoriteItem[]) => {
      setFavoritesState(newFavorites);
      if (!useServerStorage) {
        saveLocalFavorites(newFavorites);
      }
    },
    [useServerStorage],
  );

  // Add a new favorite
  const addFavorite = useCallback(
    async (favorite: Omit<FavoriteItem, "id">): Promise<FavoriteItem> => {
      if (useServerStorage && endpoint.create) {
        // Set form values for server creation
        endpoint.create.form.setValue(
          "characterId",
          favorite.characterId ?? "",
        );
        if (favorite.customName) {
          endpoint.create.form.setValue("customName", favorite.customName);
        }
        if (favorite.voice) {
          endpoint.create.form.setValue("voice", favorite.voice);
        }
        // Set model selection
        endpoint.create.form.setValue(
          "modelSelection",
          favorite.modelSelection,
        );

        // Use submitForm with onSuccess callback to get the response
        return new Promise<FavoriteItem>((resolve, reject) => {
          endpoint.create?.submitForm({
            onSuccess: ({ responseData }) => {
              if (responseData && "id" in responseData) {
                const newFavorite: FavoriteItem = {
                  ...favorite,
                  id: responseData.id as string,
                };
                endpoint.read?.refetch?.();
                resolve(newFavorite);
              } else {
                reject(new Error("Invalid server response"));
              }
            },
            onError: ({ error }) => {
              reject(error);
            },
          });
        });
      }

      // Local storage for non-authenticated users
      const localFavorite: FavoriteItem = {
        ...favorite,
        id: `local-${Date.now()}`,
      };
      const newFavorites = [...favorites, localFavorite];
      setFavoritesState(newFavorites);
      saveLocalFavorites(newFavorites);
      return localFavorite;
    },
    [useServerStorage, endpoint, favorites],
  );

  // Update a favorite
  const updateFavorite = useCallback(
    async (id: string, updates: FavoriteUpdateRequestOutput): Promise<void> => {
      if (useServerStorage && !id.startsWith("local-")) {
        const response = await patchMutation.mutateAsync({
          requestData: updates,
          urlPathParams: { id },
        });

        if (response.success) {
          endpoint.read?.refetch?.();
        }
      } else {
        // Local storage for non-authenticated users
        const current = loadLocalFavorites();
        const updated = current.map((f) =>
          f.id === id
            ? {
                ...f,
                ...updates,
              }
            : f,
        );
        setFavoritesState(updated);
        saveLocalFavorites(updated);
      }
    },
    [favorites, useServerStorage, endpoint.read, patchMutation],
  );

  // Delete a favorite
  const deleteFavorite = useCallback(
    async (id: string): Promise<void> => {
      logger.debug("deleteFavorite called", {
        id,
        useServerStorage,
        favoritesCount: favorites.length,
      });

      // Update local state immediately
      const newFavorites = favorites.filter((f) => f.id !== id);
      setFavoritesState(newFavorites);

      logger.debug("deleteFavorite: state updated", {
        newCount: newFavorites.length,
      });

      if (useServerStorage && !id.startsWith("local-")) {
        // Server storage for authenticated users
        logger.debug("deleteFavorite: using server storage");
        const response = await deleteMutation.mutateAsync({
          urlPathParams: { id },
        });

        if (response.success) {
          endpoint.read?.refetch?.();
          logger.debug("deleteFavorite: server delete successful");
        } else {
          logger.error("deleteFavorite: server delete failed", { response });
        }
      } else {
        // Local storage for non-authenticated users
        logger.debug("deleteFavorite: using local storage", {
          newCount: newFavorites.length,
        });
        saveLocalFavorites(newFavorites);
        logger.debug("deleteFavorite: saved to localStorage");
      }
    },
    [favorites, useServerStorage, endpoint.read, deleteMutation, logger],
  );

  // Refetch from server/local storage
  const refetch = useCallback(() => {
    if (useServerStorage && endpoint.read?.refetch) {
      endpoint.read.refetch();
    } else {
      setFavoritesState(loadLocalFavorites());
    }
  }, [useServerStorage, endpoint.read]);

  return {
    favorites,
    isLoading,
    isAuthenticated,
    setFavorites,
    addFavorite,
    updateFavorite,
    deleteFavorite,
    refetch,
  };
}
