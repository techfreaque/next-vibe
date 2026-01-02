/**
 * Chat Thread Search Hooks
 * React hooks for searching threads with full-text search
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { definitions } from "./definition";

/**
 * Hook for searching threads with full-text search
 *
 * Features:
 * - Full-text search with relevance ranking
 * - Content snippets with highlighted matches
 * - Pagination support
 * - Sort by relevance or date
 * - Include/exclude archived threads
 *
 * Note: Consider adding debouncing in the component that uses this hook
 * to avoid excessive API calls while typing
 *
 * @param logger - Endpoint logger instance
 */
export function useThreadSearch(logger: EndpointLogger): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: false, // Disabled by default, enable when search query is provided
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 1 minute - search results can be cached longer
      },
    },
    logger,
  );
}

export type ThreadSearchEndpointReturn = EndpointReturn<typeof definitions>;
