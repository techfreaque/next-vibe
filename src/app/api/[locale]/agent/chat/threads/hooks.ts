/**
 * Chat Threads Hooks
 * React hooks for thread list and create operations
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import type { DefaultFolderId } from "../config";
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
  params: {
    rootFolderId: DefaultFolderId;
    subFolderId?: string | null;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        initialState: {
          rootFolderId: params.rootFolderId,
          subFolderId: params.subFolderId,
        },
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
  params: {
    rootFolderId: DefaultFolderId;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        initialState: {
          rootFolderId: params.rootFolderId,
          subFolderId: undefined,
        },
        queryOptions: { enabled: false },
      },
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
