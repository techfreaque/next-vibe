/**
 * Chat Folder Detail Hooks
 * React hooks for single folder operations (get, update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
      urlPathParams: { id: params.folderId },
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
    user,
  );
}

export type FolderEndpointReturn = EndpointReturn<typeof definitions>;
