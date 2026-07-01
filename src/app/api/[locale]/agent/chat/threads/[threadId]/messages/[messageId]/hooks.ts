/**
 * Chat Message Detail Hooks
 * React hooks for single message operations (get, update, delete)
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for single message operations (GET, PATCH, DELETE)
 *
 * Features:
 * - GET: Fetch message by ID
 * - PATCH: Update message content
 * - DELETE: Delete message (with cascade option for children)
 * - Cache invalidation on mutations
 *
 * @param params - Thread ID, message ID, and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useMessage(
  params: {
    threadId: string;
    messageId: string;
    enabled?: boolean;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: {
          threadId: params.threadId,
          messageId: params.messageId,
        },
        queryOptions: {
          enabled: params.enabled ?? true,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000, // 30 seconds
        },
      },
      update: {
        urlPathParams: {
          threadId: params.threadId,
          messageId: params.messageId,
        },
        formOptions: {
          persistForm: false,
        },
      },
      delete: {
        urlPathParams: {
          threadId: params.threadId,
          messageId: params.messageId,
        },
      },
    },
    logger,
    user,
  );
}

export type MessageEndpointReturn = EndpointReturn<typeof definitions>;
