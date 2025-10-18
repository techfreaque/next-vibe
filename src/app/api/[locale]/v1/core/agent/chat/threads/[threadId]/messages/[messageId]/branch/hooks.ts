/**
 * Chat Message Branch Hooks
 * React hooks for creating conversation branches
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import { definitions } from "./definition";

/**
 * Hook for creating conversation branches
 *
 * Features:
 * - POST: Create a new branch from a message
 * - Creates a new message as a sibling to the specified message
 * - Maintains tree structure integrity
 * - Auto-refetches message tree on success
 *
 * Use case: When user wants to try a different response path
 * from a specific point in the conversation
 *
 * @param params - Thread ID and message ID to branch from
 * @param logger - Endpoint logger instance
 */
export function useMessageBranch(
  params: {
    threadId: string;
    messageId: string;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlParams: {
        threadId: params.threadId,
        messageId: params.messageId,
      },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type MessageBranchEndpointReturn = EndpointReturn<typeof definitions>;
