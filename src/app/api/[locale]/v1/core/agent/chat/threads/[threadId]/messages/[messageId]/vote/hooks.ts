/**
 * Chat Message Vote Hooks
 * React hooks for voting on messages
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import { definitions } from "./definition";

/**
 * Hook for voting on messages
 *
 * Features:
 * - POST: Vote on a message (upvote, downvote, or remove vote)
 * - Updates vote score in real-time
 * - Handles vote conflicts and validation
 * - Auto-refetches message on success
 *
 * @param params - Thread ID and message ID to vote on
 * @param logger - Endpoint logger instance
 */
export function useMessageVote(
  params: {
    threadId: string;
    messageId: string;
  },
  logger: EndpointLogger,
): MessageVoteEndpointReturn {
  return useEndpoint(
    definitions,
    {
      urlPathParams: {
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

export type MessageVoteEndpointReturn = EndpointReturn<typeof definitions>;
