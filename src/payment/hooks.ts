/**
 * Payment API Hooks
 * Type-safe hooks for interacting with the Payment API
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for payment management
 * Provides both query (GET) and mutation (POST) operations
 */
export function usePayment(
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

export type PaymentEndpointReturn = EndpointReturn<typeof definitions>;
