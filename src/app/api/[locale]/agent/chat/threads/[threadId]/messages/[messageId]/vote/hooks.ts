/**
 * Chat Message Vote Hooks
 * React hooks for voting on messages
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

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
  user: JwtPayloadType,
  logger: EndpointLogger,
): MessageVoteEndpointReturn {
  return useEndpoint(
    definitions,
    {
      create: {
        urlPathParams: {
          threadId: params.threadId,
          messageId: params.messageId,
        },
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}

export type MessageVoteEndpointReturn = EndpointReturn<typeof definitions>;
