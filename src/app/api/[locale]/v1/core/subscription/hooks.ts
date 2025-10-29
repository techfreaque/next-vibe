/**
 * Subscription API Hooks
 * Production-ready hooks for comprehensive subscription management
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for subscription management
 * Provides both query (GET) and mutation (POST/PUT/DELETE) operations
 */
export function useSubscription(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000, // 60 seconds
      },
    },
    logger,
  );
}

export type SubscriptionEndpointReturn = EndpointReturn<typeof definitions>;
