/**
 * Credit System Hooks
 * React hooks for credit balance, history, and purchase operations
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import definitions from "./definition";
import historyDefinitions from "./history/definition";
import purchaseDefinitions from "./purchase/definition";

/**
 * Hook for fetching current user's credit balance
 */
export function useCredits(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 0, // Always refetch (no caching) for real-time credit updates
      },
    },
    logger,
  );
}

/**
 * Hook for fetching credit transaction history
 */
export function useCreditHistory(
  logger: EndpointLogger,
): EndpointReturn<typeof historyDefinitions> {
  return useEndpoint(
    historyDefinitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
    },
    logger,
  );
}

/**
 * Hook for purchasing credit packs
 */
export function useCreditPurchase(
  logger: EndpointLogger,
): EndpointReturn<typeof purchaseDefinitions> {
  return useEndpoint(purchaseDefinitions, {}, logger);
}
