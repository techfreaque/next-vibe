/**
 * Memories Hooks
 * React hooks for memory list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for handling memories operations
 *
 * Features:
 * - GET: Fetch all memories for the current user
 * - POST: Create a new memory
 * - PUT: Update an existing memory
 * - DELETE: Delete a memory
 * - Can be conditionally enabled/disabled
 */
export function useMemories(
  params: {
    enabled?: boolean;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): MemoriesEndpointReturn {
  const { enabled = true } = params;

  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    },
    logger,
    user,
  );
}

export type MemoriesEndpointReturn = EndpointReturn<typeof definitions>;
