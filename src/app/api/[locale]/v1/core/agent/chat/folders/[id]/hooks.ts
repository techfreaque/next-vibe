/**
 * Chat Folder Detail Hooks
 * React hooks for single folder operations (get, update, delete)
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

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
  );
}

export type FolderEndpointReturn = EndpointReturn<typeof definitions>;
