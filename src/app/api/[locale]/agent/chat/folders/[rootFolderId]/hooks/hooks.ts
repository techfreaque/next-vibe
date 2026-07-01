/**
 * Chat Folders Hooks
 * React hooks for folder list operations
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import definitions from "../definition";

/**
 * Hook for fetching folders list with hierarchical structure
 */
export function useFoldersList(
  params: { rootFolderId: DefaultFolderId },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { rootFolderId: params.rootFolderId },
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
