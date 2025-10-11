/**
 * Subscription API Hooks
 * Production-ready hooks for comprehensive subscription management
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";

import definitions from "./definition";

/****************************
 * QUERY HOOKS
 ****************************/

/**
 * Hook for fetching current user's subscription
 */
export function useSubscription(params: {
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
 * Hook for fetching subscription by user ID (admin only)
 */
export function useSubscriptionByUserId(params: {
  userId: string;
  enabled?: boolean;
  logger: EndpointLogger;
}): ReturnType<typeof useApiQuery> {
  return useApiQuery({
    endpoint: definitions.GET,
    requestData: { userId: params.userId },
    logger: params.logger,
    options: {
      enabled: params.enabled !== false && Boolean(params.userId),
    },
  });
}

/**
 * Note: Form and mutation hooks for subscription operations
 * would need to be implemented with the proper API structure
 * Currently only query hooks are supported in this simplified version
 */