/**
 * Chat Thread Detail Hooks
 * React hooks for single thread operations (get, update, delete)
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for single thread operations (GET, PATCH, DELETE)
 *
 * Features:
 * - GET: Fetch thread by ID
 * - PATCH: Update thread (optimistic updates)
 * - DELETE: Delete thread (with confirmation)
 * - Cache invalidation on mutations
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useThread(
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
          enabled: params.enabled ?? true,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000, // 30 seconds
        },
      },
      update: {
        urlPathParams: { threadId: params.threadId },
        formOptions: {
          persistForm: false,
        },
      },
      delete: {
        urlPathParams: { threadId: params.threadId },
      },
    },
    logger,
    user,
  );
}

export type ThreadEndpointReturn = EndpointReturn<typeof definitions>;
