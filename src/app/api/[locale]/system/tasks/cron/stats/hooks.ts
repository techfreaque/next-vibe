/**
 * Cron Stats Hooks
 * React hooks for cron statistics operations
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for fetching cron statistics
 */
export function useCronStats(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
      },
    },
    logger,
    user,
  );
}

export type CronStatsEndpointReturn = EndpointReturn<typeof definitions>;
