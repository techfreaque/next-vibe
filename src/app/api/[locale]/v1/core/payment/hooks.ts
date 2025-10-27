/**
 * Payment API Hooks
 * Type-safe hooks for interacting with the Payment API
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for payment management
 * Provides both query (GET) and mutation (POST) operations
 */
export function usePayment(
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

export type PaymentEndpointReturn = EndpointReturn<typeof definitions>;
