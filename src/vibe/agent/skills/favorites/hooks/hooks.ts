/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import type { EndpointLogger } from "next-vibe/logger/types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import { useWidgetUser } from "next-vibe/unified-ui/_shared/use-widget-context";
import { useMemo } from "react";

import type { UseEndpointOptions } from "../../../../platforms/react/hooks/endpoint-types";
import favoritesDefinition, { type FavoriteCard } from "../definition";

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
 * Optional params allow usage outside ChatProvider (e.g. ai-run widget)
 */
export function useChatFavorites(
  logger: EndpointLogger,
  overrides: {
    activeFavoriteId: string | null;
  },
): UseChatFavoritesReturn {
  const user = useWidgetUser();
  const activeFavoriteId = overrides?.activeFavoriteId ?? null;
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
              enabled: user !== undefined,
              refetchOnWindowFocus: true,
              staleTime: 60 * 1000,
            },
          },
        }) satisfies UseEndpointOptions<typeof favoritesDefinition>,
      [user],
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
