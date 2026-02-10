/**
 * Individual Cron Task Hooks
 * React hooks for individual cron task operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import endpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/task/[id]/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

/**
 * Hook for individual task operations (GET, PUT, DELETE)
 * Provides form handling and mutation capabilities for a single task
 */
export function useCronTask(
  user: JwtPayloadType,
  params: {
    taskId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints> {
  return useEndpoint(
    endpoints,
    {
      read: {
        urlPathParams: { id: params.taskId },
        queryOptions: {
          enabled: params.enabled ?? true,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
      },
    },
    logger,
    user,
  );
}

export type CronTaskEndpointReturn = EndpointReturn<typeof endpoints>;
