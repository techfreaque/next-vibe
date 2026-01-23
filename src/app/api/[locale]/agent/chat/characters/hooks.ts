/**
 * Characters Hooks
 * React hooks for character operations and model selection
 */

"use client";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook to fetch all characters (default + custom)
 * - All users use API (endpoint is public)
 * - Public users: read-only access to defaults
 * - Authenticated users: can create/edit custom characters
 */
export function useCharacters(
  logger: EndpointLogger,
): ReturnType<typeof useEndpoint<typeof definitions>> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
    logger,
  );
}
