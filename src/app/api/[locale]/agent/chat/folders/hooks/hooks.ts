/**
 * Chat Folders Hooks
 * React hooks for folder list operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "../definition";

/**
 * Hook for fetching folders list with hierarchical structure
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
    },
    logger,
    user,
  );
}

export type FoldersListEndpointReturn = EndpointReturn<typeof definitions>;
