/**
 * Chat Message Path Hooks
 * React hooks for retrieving conversation paths through message tree
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

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
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlParams: { threadId: params.threadId },
      queryOptions: {
        enabled: params.enabled ?? false, // Disabled by default
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
    },
    logger,
  );
}

export type MessagePathEndpointReturn = EndpointReturn<typeof definitions>;
