/**
 * Chat Thread Permissions Hooks
 * React hooks for thread permission operations (get, update)
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for thread permission operations (GET, PATCH)
 *
 * Features:
 * - GET: Fetch thread permissions (rolesView, rolesEdit, rolesPost, rolesModerate, rolesAdmin)
 * - PATCH: Update thread permissions
 * - Cache invalidation on mutations
 *
 * @param params - Thread ID and optional enabled flag
 * @param logger - Endpoint logger instance
 */
export function useThreadPermissions(
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
    },
    logger,
    user,
  );
}

export type ThreadPermissionsEndpointReturn = EndpointReturn<
  typeof definitions
>;
