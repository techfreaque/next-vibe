/**
 * Chat Thread Share Links Hooks
 * React hooks for thread share link operations (get, create, update, revoke)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for thread share link operations (GET, POST, PATCH, DELETE)
 *
 * Features:
 * - GET: Fetch all share links for a thread
 * - POST: Create a new share link
 * - PATCH: Update an existing share link
 * - DELETE: Revoke (deactivate) a share link
 * - Cache invalidation on mutations
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useThreadShareLinks(
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
        enabled: params.enabled ?? true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type ThreadShareLinksEndpointReturn = EndpointReturn<typeof definitions>;
