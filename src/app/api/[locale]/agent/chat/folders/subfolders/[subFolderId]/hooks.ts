/**
 * Chat Folder Detail Hooks
 * React hooks for single folder operations (get, update, delete)
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for single folder operations (GET, PATCH, DELETE)
 *
 * Features:
 * - GET: Fetch folder by ID
 * - PATCH: Update folder (including moving via parentId)
 * - DELETE: Delete folder (with cascade option)
 * - Cache invalidation on mutations
 *
 * @param params - Folder ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useFolder(
  params: {
    folderId: string;
    enabled?: boolean;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { subFolderId: params.folderId },
        queryOptions: {
          enabled: params.enabled ?? true,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000, // 30 seconds
        },
      },
      delete: {
        urlPathParams: { subFolderId: params.folderId },
      },
    },
    logger,
    user,
  );
}

export type FolderEndpointReturn = EndpointReturn<typeof definitions>;
