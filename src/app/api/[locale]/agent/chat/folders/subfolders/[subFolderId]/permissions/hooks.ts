/**
 * Chat Folder Permissions Hooks
 * React hooks for folder permission operations (get, update)
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for folder permission operations (GET, PATCH)
 *
 * Features:
 * - GET: Fetch folder permissions (rolesView, rolesManage, rolesCreateThread, rolesPost, rolesModerate, rolesAdmin)
 * - PATCH: Update folder permissions
 * - Cache invalidation on mutations
 *
 * @param params - Folder ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useFolderPermissions(
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
      update: {
        urlPathParams: { subFolderId: params.folderId },
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}

export type FolderPermissionsEndpointReturn = EndpointReturn<
  typeof definitions
>;
