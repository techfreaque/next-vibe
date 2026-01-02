/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ContentLevelFilter,
  IntelligenceLevelFilter,
  ModelSelectionMode,
  PriceLevelFilter,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import favoriteByIdDefinition, {
  type FavoriteUpdateRequestInput,
} from "../../../../favorites/[id]/definition";
import favoritesDefinition from "../../../../favorites/definition";
import type { FavoriteItem } from "./favorites-bar";
import { STORAGE_KEYS } from "./types";

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
  localStorage.setItem(STORAGE_KEYS.FAVORITE_CHARACTERS, JSON.stringify(favorites));
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
  updateFavorite: (id: string, updates: Partial<FavoriteItem>) => Promise<void>;
  deleteFavorite: (id: string) => Promise<void>;
  setActiveFavorite: (id: string) => Promise<void>;
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
  const isAuthenticated = useMemo(() => user !== undefined && !user.isPublic, [user]);

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
        const serverFavorites = endpoint.read.response.data.favorites.map(
          (serverFav): FavoriteItem => ({
            id: serverFav.id,
            characterId: serverFav.characterId,
            customName: serverFav.customName ?? undefined,
            customIcon: serverFav.customIcon ?? undefined,
            voice: serverFav.voice ?? undefined,
            modelSettings: {
              mode: serverFav.mode,
              filters: {
                intelligence: serverFav.intelligence,
                maxPrice: serverFav.maxPrice,
                content: serverFav.content,
              },
              manualModelId: serverFav.manualModelId ?? undefined,
            },
            isActive: serverFav.isActive,
          }),
        );
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
        endpoint.create.form.setValue("characterId", favorite.characterId ?? "");
        if (favorite.customName) {
          endpoint.create.form.setValue("customName", favorite.customName);
        }
        if (favorite.voice) {
          endpoint.create.form.setValue("voice", favorite.voice);
        }
        endpoint.create.form.setValue("mode", favorite.modelSettings.mode);
        endpoint.create.form.setValue("intelligence", favorite.modelSettings.filters.intelligence);
        endpoint.create.form.setValue("maxPrice", favorite.modelSettings.filters.maxPrice);
        endpoint.create.form.setValue("content", favorite.modelSettings.filters.content);
        if (favorite.modelSettings.manualModelId) {
          endpoint.create.form.setValue("manualModelId", favorite.modelSettings.manualModelId);
        }

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
    async (id: string, updates: Partial<FavoriteItem>): Promise<void> => {
      // Update local state immediately for responsiveness
      const newFavorites = favorites.map((f) => (f.id === id ? { ...f, ...updates } : f));
      setFavoritesState(newFavorites);

      if (useServerStorage && !id.startsWith("local-")) {
        // Build PATCH request data
        const requestData: Partial<FavoriteUpdateRequestInput> = {};
        if (updates.characterId !== undefined) {
          requestData.characterId = updates.characterId ?? undefined;
        }
        if (updates.customName !== undefined) {
          requestData.customName = updates.customName;
        }
        if (updates.voice !== undefined) {
          requestData.voice = updates.voice;
        }
        if (updates.isActive !== undefined) {
          requestData.isActive = updates.isActive;
        }
        if (updates.modelSettings) {
          requestData.mode = updates.modelSettings.mode;
          requestData.intelligence = updates.modelSettings.filters.intelligence;
          requestData.maxPrice = updates.modelSettings.filters.maxPrice;
          requestData.content = updates.modelSettings.filters.content;
          if (updates.modelSettings.manualModelId !== undefined) {
            requestData.manualModelId = updates.modelSettings.manualModelId ?? null;
          }
        }

        const response = await patchMutation.mutateAsync({
          requestData,
          urlPathParams: { id },
        });

        if (response.success) {
          endpoint.read?.refetch?.();
        }
      } else {
        // Local storage for non-authenticated users
        saveLocalFavorites(newFavorites);
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

  // Set a favorite as active
  const setActiveFavorite = useCallback(
    async (id: string): Promise<void> => {
      // Update local state immediately
      const newFavorites = favorites.map((f) => ({
        ...f,
        isActive: f.id === id,
      }));
      setFavoritesState(newFavorites);

      if (useServerStorage && !id.startsWith("local-")) {
        const requestData: Partial<FavoriteUpdateRequestInput> = {
          isActive: true,
        };
        const response = await patchMutation.mutateAsync({
          requestData,
          urlPathParams: { id },
        });

        if (response.success) {
          endpoint.read?.refetch?.();
        }
      } else {
        // Local storage for non-authenticated users
        saveLocalFavorites(newFavorites);
      }
    },
    [favorites, useServerStorage, endpoint.read, patchMutation],
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
    setActiveFavorite,
    refetch,
  };
}
