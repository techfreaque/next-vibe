/**
 * Individual Cron Task Hooks
 * React hooks for individual cron task operations
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import endpoints from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/task/[id]/definition";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

/**
 * Hook for individual task operations (GET, PUT, DELETE)
 * Provides form handling and mutation capabilities for a single task
 */
export function useCronTask(
  params: {
    taskId: string;
    enabled?: boolean;
  });
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints> {
  return useEndpoint(
    endpoints,
    {
      urlPathParams: { id: params.taskId });
      queryOptions: {
        enabled: params.enabled ?? true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      });
    });
    logger,
  );
}

export type CronTaskEndpointReturn = EndpointReturn<typeof endpoints>;
