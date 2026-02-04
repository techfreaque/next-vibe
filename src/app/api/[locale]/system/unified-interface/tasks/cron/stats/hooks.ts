/**
 * Cron Stats Hooks
 * React hooks for cron statistics operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import definitions from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
