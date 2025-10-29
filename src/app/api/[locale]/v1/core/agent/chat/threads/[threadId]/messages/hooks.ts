/**
 * Chat Messages Hooks
 * React hooks for message list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching messages list with tree structure support
 *
 * Features:
 * - Returns flat array with parentId, depth, childrenIds
 * - Component can transform to message tree as needed
 * - Supports filtering by threadId
 * - Pagination support
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useMessagesList(
  params: {
    threadId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlPathParams: { threadId: params.threadId },
      queryOptions: {
        enabled: params.enabled ?? true,
        refetchOnWindowFocus: true,
        staleTime: 5 * 1000, // 5 seconds
      },
    },
    logger,
  );
}

/**
 * Hook for creating new messages
 *
 * Features:
 * - Form handling for message creation
 * - Support for parentId (branching conversations)
 * - Role, content, model, tone configuration
 * - Optimistic UI updates
 * - Auto-refetches message list on success
 *
 * @param params - Thread ID
 * @param logger - Endpoint logger instance
 */
export function useCreateMessage(
  params: {
    threadId: string;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlPathParams: { threadId: params.threadId },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type MessagesListEndpointReturn = EndpointReturn<typeof definitions>;
