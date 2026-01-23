/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useCallback, useMemo } from "react";

import type { CharacterListItem } from "@/app/api/[locale]/agent/chat/characters/definition";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { UseEndpointOptions } from "../../../system/unified-interface/react/hooks/endpoint-types";
import type { FavoriteCreateRequestOutput } from "./create/definition";
import favoritesCreateDefinition from "./create/definition";
import favoritesDefinition, { type FavoriteCard } from "./definition";
import { FavoritesRepositoryClient } from "./repository-client";

interface UseChatFavoritesOptions {
  user: JwtPayloadType | undefined;
  logger: EndpointLogger;
  characters: Record<string, CharacterListItem>;
}

export interface UseChatFavoritesReturn {
  favorites: FavoriteCard[];
  activeFavoriteId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  endpoint: ReturnType<typeof useEndpoint<typeof favoritesDefinition>>;
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
}

/**
 * Hook for managing chat favorites
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage via callbacks
 */
export function useChatFavorites({
  user,
  logger,
  characters,
}: UseChatFavoritesOptions): UseChatFavoritesReturn {
  const { activeFavoriteId } = useChatContext();
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  // Only enable query when characters are loaded (needed for localStorage mode)
  const hasCharacters = Object.keys(characters).length > 0;

  const endpointOptions: UseEndpointOptions<typeof favoritesDefinition> =
    useMemo(
      () =>
        ({
          read: {
            queryOptions: {
              enabled: hasCharacters,
              refetchOnWindowFocus: true,
              staleTime: 60 * 1000,
            },
          },
          storage: isAuthenticated
            ? undefined
            : {
                mode: "localStorage" as const,
                callbacks: FavoritesRepositoryClient.localStorageListCallbacks,
              },
        }) satisfies UseEndpointOptions<typeof favoritesDefinition>,
      [hasCharacters, isAuthenticated],
    );

  const endpoint = useEndpoint(favoritesDefinition, endpointOptions, logger);

  // Create endpoint for adding favorites
  const createEndpointOptions: UseEndpointOptions<
    typeof favoritesCreateDefinition
  > = useMemo(
    () => ({
      storage: isAuthenticated
        ? undefined
        : {
            mode: "localStorage" as const,
            callbacks: FavoritesRepositoryClient.localStorageCreateCallbacks,
          },
    }),
    [isAuthenticated],
  );

  const createEndpoint = useEndpoint(
    favoritesCreateDefinition,
    createEndpointOptions,
    logger,
  );

  // Extract favorites from flat array
  const favorites = useMemo(() => {
    return endpoint.read?.data?.favoritesList ?? [];
  }, [endpoint.read?.data]);

  // Add favorite with cache invalidation
  const addFavorite = useCallback(
    async (data: FavoriteCreateRequestOutput): Promise<string | null> => {
      createEndpoint.create.form.reset(data);

      const result = await new Promise<string | null>((resolve, reject) => {
        createEndpoint.create.submitForm({
          onSuccess: ({ responseData }) => {
            resolve(responseData.id);
          },
          onError: ({ error }): void => reject(error),
        });
      });

      if (result) {
        await apiClient.refetchEndpoint(favoritesDefinition.GET, logger);
      }

      return result;
    },
    [createEndpoint, logger],
  );

  return {
    favorites,
    activeFavoriteId,
    isLoading: endpoint.read?.isLoading ?? false,
    isAuthenticated,
    endpoint,
    addFavorite,
  };
}
