/**
 * Chat Message Detail Hooks
 * React hooks for single message operations (get, update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}

export type MessageEndpointReturn = EndpointReturn<typeof definitions>;
