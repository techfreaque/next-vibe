/**
 * AI Tools Hooks
 * React hooks for fetching available AI tools
 */

"use client";

import { useMemo } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching available AI tools
 *
 * Features:
 * - Returns all AI tools available for current user
 * - Respects user permissions
 * - Automatically filters enabled tools
 * - Caches results for performance
 */
export function useAIToolsList(
  logger: EndpointLogger,
  params?: {
    enabled?: boolean;
  });
): ReturnType<typeof useEndpoint<typeof definitions>> {
  const queryOptions = useMemo(
    () => ({
      enabled: params?.enabled !== false,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 60 seconds
    }),
    [params?.enabled],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
    });
    logger,
  );
}

/**
 * Type export for convenience
 */
export type AIToolsListEndpointReturn = EndpointReturn<typeof definitions>;
