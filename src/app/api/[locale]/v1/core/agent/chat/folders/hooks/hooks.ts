/**
 * Chat Folders Hooks
 * React hooks for folder list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "../definition";

/**
 * Hook for fetching folders list with hierarchical structure
 *
 * Features:
 * - Hierarchical folder structure (parent-child relationships)
 * - Returns flat array with parentId and childrenIds
 * - Component can transform to tree structure as needed
 * - Supports filtering by parentId
 */
export function useFoldersList(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 10 * 1000, // 10 seconds
      },
      formOptions: {
        defaultValues: {
          folder: {
            rootFolderId: "private",
            name: "",
          },
        },
      },
    },
    logger,
  );
}

/**
 * Hook for creating new folders
 *
 * Features:
 * - Form handling for folder creation
 * - Support for parentId (nested folders)
 * - Icon and color customization
 * - Auto-refetches folder list on success
 */
export function useCreateFolder(
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

export type FoldersListEndpointReturn = EndpointReturn<typeof definitions>;
