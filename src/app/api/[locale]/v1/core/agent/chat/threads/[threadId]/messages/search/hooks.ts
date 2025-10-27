/**
 * Chat Message Search Hooks
 * React hooks for searching messages within a thread
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for searching messages within a specific thread
 *
 * Features:
 * - Full-text search with relevance ranking
 * - Content snippets with highlighted matches
 * - Search limited to specified thread only
 * - Pagination support
 *
 * Note: Consider adding debouncing in the component that uses this hook
 * to avoid excessive API calls while typing
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useMessageSearch(
  params: {
    threadId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlPathParams: { threadId: params.threadId },
      queryOptions: {
        enabled: params.enabled ?? false, // Disabled by default
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 1 minute - search results can be cached longer
      },
    },
    logger,
  );
}

export type MessageSearchEndpointReturn = EndpointReturn<typeof definitions>;
