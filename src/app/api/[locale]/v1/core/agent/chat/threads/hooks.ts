/**
 * Chat Threads Hooks
 * React hooks for thread list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching threads list with filtering and pagination
 *
 * Supports:
 * - Pagination (limit, offset)
 * - Filtering (status, folderId, isPinned, dateFrom, dateTo)
 * - Sorting (createdAt, updatedAt, title)
 */
export function useThreadsList(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 5 * 1000, // 5 seconds
      },
    },
    logger,
  );
}

/**
 * Hook for creating new threads
 *
 * Provides form handling and mutation capabilities
 * Auto-refetches thread list on success
 */
export function useCreateThread(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type ThreadsListEndpointReturn = EndpointReturn<typeof definitions>;
