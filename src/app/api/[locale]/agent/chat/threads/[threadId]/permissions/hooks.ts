/**
 * Chat Thread Permissions Hooks
 * React hooks for thread permission operations (get, update)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlPathParams: { threadId: params.threadId },
      queryOptions: {
        enabled: params.enabled ?? true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type ThreadPermissionsEndpointReturn = EndpointReturn<
  typeof definitions
>;
