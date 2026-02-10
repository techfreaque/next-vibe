/**
 * Chat Message Path Hooks
 * React hooks for retrieving conversation paths through message tree
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { definitions } from "./definition";

/**
 * Hook for retrieving conversation paths
 *
 * Features:
 * - GET: Retrieve ordered message array for a specific path
 * - Supports branchIndices parameter for path selection
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
