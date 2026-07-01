/**
 * Chat Message Path Hooks
 * React hooks for retrieving conversation paths through message tree
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import type { DefaultFolderId } from "../../../../config";
import { definitions } from "./definition";

/**
 * Hook for retrieving conversation paths
 *
 * Features:
 * - GET: Retrieve ordered message array for a specific path
 * - Supports leafMessageId parameter for path selection
 * - Returns messages in chronological order
 * - Useful for displaying a specific conversation thread
 *
 * Use case: When displaying a linear view of a branched conversation,
 * this hook retrieves the specific path through the tree based on
 * which branches were selected at each level
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useMessagePath(
  params: {
    threadId: string;
    rootFolderId: DefaultFolderId;
    leafMessageId: string | undefined;
    enabled?: boolean;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { threadId: params.threadId },
        initialState: {
          rootFolderId: params.rootFolderId,
          leafMessageId: params.leafMessageId,
        },
        queryOptions: {
          enabled: params.enabled ?? false, // Disabled by default
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000, // 30 seconds
        },
      },
    },
    logger,
    user,
  );
}

export type MessagePathEndpointReturn = EndpointReturn<typeof definitions>;
