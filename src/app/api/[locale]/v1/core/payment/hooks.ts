/**
 * Payment API Hooks
 * Simplified hooks for interacting with the Payment API
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";

import definitions from "./definition";

/****************************
 * QUERY HOOKS
 ****************************/

/**
 * Hook for fetching payment methods and transactions
 */
export function usePaymentInfo(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): ReturnType<typeof useApiQuery> {
  return useApiQuery({
    endpoint: definitions.GET,
    logger: params.logger,
    options: {
      enabled: params.enabled !== false,
    },
  });
}

/**
 * Hook for fetching specific payment transaction
 */
export function usePaymentTransaction(params: {
  paymentId: string;
  enabled?: boolean;
  logger: EndpointLogger;
}): ReturnType<typeof useApiQuery> {
  return useApiQuery({
    endpoint: definitions.GET,
    requestData: { paymentId: params.paymentId },
    logger: params.logger,
    options: {
      enabled: params.enabled !== false && Boolean(params.paymentId),
    },
  });
}

/**
 * Hook for fetching payment by session ID
 */
export function usePaymentBySession(params: {
  sessionId: string;
  enabled?: boolean;
  logger: EndpointLogger;
}): ReturnType<typeof useApiQuery> {
  return useApiQuery({
    endpoint: definitions.GET,
    requestData: { sessionId: params.sessionId },
    logger: params.logger,
    options: {
      enabled: params.enabled !== false && Boolean(params.sessionId),
    },
  });
}

/**
 * Note: Form and mutation hooks for payment operations
 * would need to be implemented with the proper API structure
 * Currently only query hooks are supported in this simplified version
 */
