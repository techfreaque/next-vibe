/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useMemo } from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UseEndpointOptions } from "../../../system/unified-interface/react/hooks/endpoint-types";
import favoritesDefinition, { type FavoriteCard } from "./definition";

export interface UseChatFavoritesReturn {
  favorites: FavoriteCard[];
  activeFavoriteId: string | null;
  isInitialLoading: boolean;
  isAuthenticated: boolean;
  endpoint: ReturnType<typeof useEndpoint<typeof favoritesDefinition>>;
}

/**
 * Hook for managing chat favorites
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage via callbacks
 */
export function useChatFavorites(
  logger: EndpointLogger,
): UseChatFavoritesReturn {
  const { activeFavoriteId, user } = useChatContext();
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  const endpointOptions: UseEndpointOptions<typeof favoritesDefinition> =
    useMemo(
      () =>
        ({
          read: {
            queryOptions: {
              enabled: true,
              refetchOnWindowFocus: true,
              staleTime: 60 * 1000,
            },
          },
        }) satisfies UseEndpointOptions<typeof favoritesDefinition>,
      [],
    );

  const endpoint = useEndpoint(
    favoritesDefinition,
    endpointOptions,
    logger,
    user,
  );

  // Extract favorites from flat array
  const favorites = useMemo(() => {
    return endpoint.read?.data?.favorites ?? [];
  }, [endpoint.read?.data]);

  return {
    favorites,
    activeFavoriteId,
    isInitialLoading: !endpoint.read?.data,
    isAuthenticated,
    endpoint,
  };
}
