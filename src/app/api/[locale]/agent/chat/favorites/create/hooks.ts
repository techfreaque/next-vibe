/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useCallback, useMemo } from "react";

import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import favoritesGetDefinition from "../definition";
import { FavoritesRepositoryClient } from "../repository-client";
import favoritesDefinition, {
  type FavoriteCreateRequestOutput,
} from "./definition";

interface UseFavoriteCreateOptions {
  user: JwtPayloadType | undefined;
  logger: EndpointLogger;
}

export interface UseFavoriteCreateReturn {
  isLoading: boolean;
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
}

/**
 * Hook for creating favorites
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage via callbacks
 */
export function useFavoriteCreate({
  user,
  logger,
}: UseFavoriteCreateOptions): UseFavoriteCreateReturn {
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  const endpointOptions = useMemo(
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

  const endpoint = useEndpoint(favoritesDefinition, endpointOptions, logger);

  // Create operation
  const addFavorite = useCallback(
    async (data: FavoriteCreateRequestOutput): Promise<string | null> => {
      endpoint.create.form.reset(data);
      return new Promise<string | null>((resolve, reject) => {
        endpoint.create.submitForm({
          onSuccess: ({ responseData }) => {
            void apiClient.refetchEndpoint(favoritesGetDefinition.GET, logger);

            resolve(responseData.id);
          },
          onError: ({ error }): void => reject(error),
        });
      });
    },
    [endpoint, logger],
  );

  return {
    isLoading: endpoint.create.isSubmitting,
    addFavorite,
  };
}
