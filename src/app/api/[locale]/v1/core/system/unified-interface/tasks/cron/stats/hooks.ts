/**
 * Cron Stats Hooks
 * React hooks for cron statistics operations
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import definitions from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/stats/definition";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

/**
 * Hook for fetching cron statistics
 */
export function useCronStats(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      });
    });
    logger,
  );
}

export type CronStatsEndpointReturn = EndpointReturn<typeof definitions>;
