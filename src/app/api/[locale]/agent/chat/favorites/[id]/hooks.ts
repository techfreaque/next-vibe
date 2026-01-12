/**
 * Single Favorite Hooks
 * React hooks for single favorite operations (get, update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching a single favorite by ID
 *
 * Features:
 * - Fetches full favorite details including all configuration
 * - Returns complete favorite data for editing
 */
export function useFavorite(
  favoriteId: string,
  logger: EndpointLogger,
): FavoriteEndpointReturn {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: !!favoriteId,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      urlPathParams: { id: favoriteId },
    },
    logger,
  );
}

export type FavoriteEndpointReturn = EndpointReturn<typeof definitions>;
