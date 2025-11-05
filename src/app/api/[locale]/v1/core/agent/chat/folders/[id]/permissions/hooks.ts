/**
 * Chat Folder Permissions Hooks
 * React hooks for folder permission operations (get, update)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for folder permission operations (GET, PATCH)
 *
 * Features:
 * - GET: Fetch folder permissions (rolesRead, rolesWrite, rolesHide, rolesDelete)
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

export type FolderPermissionsEndpointReturn = EndpointReturn<typeof definitions>;

