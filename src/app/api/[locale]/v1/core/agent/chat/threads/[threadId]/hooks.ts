/**
 * Chat Thread Detail Hooks
 * React hooks for single thread operations (get, update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for single thread operations (GET, PATCH, DELETE)
 *
 * Features:
 * - GET: Fetch thread by ID
 * - PATCH: Update thread (optimistic updates)
 * - DELETE: Delete thread (with confirmation)
 * - Cache invalidation on mutations
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useThread(
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

export type ThreadEndpointReturn = EndpointReturn<typeof definitions>;
