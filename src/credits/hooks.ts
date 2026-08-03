/**
 * Credit System Hooks
 * React hooks for credit balance, history, and purchase operations
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useCallback, useMemo } from "react";

import definitions, { type CreditsGetResponseOutput } from "./definition";

export interface UseCreditsReturn extends EndpointReturn<typeof definitions> {
  /**
   * Refetch credits from server to sync with actual state
   */
  refetchCredits: () => void;
}

/**
 * Hook for fetching current user's credit balance with optimistic updates
 * Optimized with 10-second cache to reduce excessive API calls
 *
 * @param user - JWT payload for the current user
 * @param logger - Endpoint logger for tracking requests
 * @param initialData - Initial credit data from server, or null if not available (hook disabled when null)
 */
export function useCredits(
  user: JwtPayloadType,
  logger: EndpointLogger,
  // Pass null when credits should not be fetched (e.g., unauthenticated users)
  initialData: CreditsGetResponseOutput | null,
): UseCreditsReturn | null {
  // Determine if hook is enabled
  const isEnabled = initialData !== null;

  const endpoint = useEndpoint(
    definitions,
    {
      read: {
        // Pass initial data - this will populate the cache properly
        // When initialData is null, the hook is effectively disabled
        initialData: initialData ?? undefined,
        queryOptions: {
          refetchOnWindowFocus: isEnabled,
          staleTime: 10 * 1000, // 10 seconds cache to prevent excessive refetching
          enabled: isEnabled,
        },
      },
      subscribeToEvents: isEnabled,
    },
    logger,
    user,
  );

  /**
   * Refetch credits from server
   */
  const refetchCredits = useCallback(async () => {
    if (!endpoint.read?.refetch) {
      logger.warn("Credits refetch not available");
      return;
    }
    await endpoint.read.refetch();
  }, [endpoint.read, logger]);

  const result = useMemo(
    () => ({
      ...endpoint,
      refetchCredits,
    }),
    [endpoint, refetchCredits],
  );

  // Return null when disabled (no initial data provided) - after all hooks are called
  if (!isEnabled) {
    return null;
  }

  return result;
}
