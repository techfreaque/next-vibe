/**
 * Chat Folders Hooks
 * React hooks for folder list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { DefaultFolderId } from "../../config";
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
          staleTime: 10 * 1000, // 10 seconds
        },
      },
      create: {
        formOptions: {
          defaultValues: {
            folder: {
              rootFolderId: DefaultFolderId.PRIVATE,
              name: "",
              icon: "folder",
            },
          },
        },
      },
    },
    logger,
    user,
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

export type FoldersListEndpointReturn = EndpointReturn<typeof definitions>;
