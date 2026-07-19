/**
 * Subscription API Hooks
 * Production-ready hooks for comprehensive subscription management
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for subscription management
 * Provides both query (GET) and mutation (POST/PUT/DELETE) operations
 */
export function useSubscription(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: true,
          staleTime: 60 * 1000, // 60 seconds
        },
      },
    },
    logger,
    user,
  );
}

export type SubscriptionEndpointReturn = EndpointReturn<typeof definitions>;
