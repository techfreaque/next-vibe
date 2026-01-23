/**
 * Single Favorite Hooks
 * React hooks for single favorite operations (get, update, delete)
 */

"use client";

import { useCallback, useMemo } from "react";

import type {
  EndpointReturn,
  UseEndpointOptions,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import favoritesListDefinition from "../definition";
import { FavoritesRepositoryClient } from "../repository-client";
import type { FavoriteUpdateRequestOutput } from "./definition";
import definitions from "./definition";

/**
 * Hook for fetching a single favorite by ID
 *
 * Features:
 * - Fetches full favorite details including all configuration
 * - Returns complete favorite data for editing
 * - Supports both API and localStorage storage
 * - Provides updateFavorite and deleteFavorite functions
 */
export function useFavorite(
  favoriteId: string | null,
  user: JwtPayloadType,
  logger: EndpointLogger,
): UseFavoriteReturn {
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  const endpointOptions: UseEndpointOptions<typeof definitions> = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: !!favoriteId,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
        },
      },
      urlPathParams: favoriteId ? { id: favoriteId } : undefined,
      storage: isAuthenticated
        ? undefined
        : {
            mode: "localStorage" as const,
            callbacks: FavoritesRepositoryClient.byIdCallbacks,
          },
    }),
    [favoriteId, isAuthenticated],
  );

  const endpoint = useEndpoint(definitions, endpointOptions, logger);

  const updateFavorite = useCallback(
    async (updates: FavoriteUpdateRequestOutput): Promise<void> => {
      await endpoint.update.submit(updates);

      // Invalidate the favorites list cache
      apiClient.updateEndpointData(
        favoritesListDefinition.GET,
        logger,
        (oldData) => {
          if (!oldData?.success || !favoriteId) {
            return oldData;
          }

          // Update the favorite in the list
          return {
            success: true,
            data: {
              favoritesList: oldData.data.favoritesList.map((fav) =>
                fav.id === favoriteId ? { ...fav, ...updates } : fav,
              ),
            },
          };
        },
        undefined,
      );
    },
    [endpoint, logger, favoriteId],
  );

  const deleteFavorite = useCallback(async (): Promise<void> => {
    await endpoint.delete.submit();

    // Invalidate the favorites list cache
    apiClient.updateEndpointData(
      favoritesListDefinition.GET,
      logger,
      (oldData) => {
        if (!oldData?.success || !favoriteId) {
          return oldData;
        }

        // Remove the favorite from the list
        return {
          success: true,
          data: {
            favoritesList: oldData.data.favoritesList.filter(
              (fav) => fav.id !== favoriteId,
            ),
          },
        };
      },
      undefined,
    );
  }, [endpoint, logger, favoriteId]);

  return {
    ...endpoint,
    updateFavorite,
    deleteFavorite,
  };
}

export type FavoriteEndpointReturn = EndpointReturn<typeof definitions>;

export interface UseFavoriteReturn extends FavoriteEndpointReturn {
  updateFavorite: (updates: FavoriteUpdateRequestOutput) => Promise<void>;
  deleteFavorite: () => Promise<void>;
}
