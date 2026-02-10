/**
 * Chat Message Branch Hooks
 * React hooks for creating conversation branches
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

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
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
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

export type MessageBranchEndpointReturn = EndpointReturn<typeof definitions>;
