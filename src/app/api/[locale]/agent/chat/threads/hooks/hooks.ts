/**
 * Chat Threads Hooks
 * React hooks for thread list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "../definition";

/**
 * Hook for fetching threads list with filtering and pagination
 *
 * Supports:
 * - Pagination (limit, offset)
 * - Filtering (status, folderId, isPinned, dateFrom, dateTo)
 * - Sorting (createdAt, updatedAt, title)
 */
export function useThreadsList(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: true,
          staleTime: 5 * 1000, // 5 seconds
        },
      },
    },
    logger,
    user,
  );
}

/**
 * Hook for creating new threads
 *
 * Provides form handling and mutation capabilities
 * Auto-refetches thread list on success
 */
export function useCreateThread(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      create: {
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}

export type ThreadsListEndpointReturn = EndpointReturn<typeof definitions>;
