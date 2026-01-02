/**
 * Cron Tasks Hooks
 * React hooks for cron tasks operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import taskEndpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/task/[id]/definition";
import { endpoints } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";

/**
 * Hook for fetching cron tasks list
 */
export function useCronTasksList(logger: EndpointLogger): EndpointReturn<typeof endpoints> {
  return useEndpoint(endpoints, {}, logger);
}

/**
 * Hook for individual task operations (GET/PUT/DELETE)
 * Provides form handling and mutation capabilities for a single task
 */
export function useCronTaskEndpoint(
  params: {
    taskId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof taskEndpoints> {
  return useEndpoint(
    taskEndpoints,
    {
      urlPathParams: { id: params.taskId },
      queryOptions: {
        enabled: params.enabled ?? true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
    },
    logger,
  );
}

/**
 * Hook for creating new cron tasks
 * Provides form handling and mutation capabilities for task creation
 */
export function useCreateCronTask(logger: EndpointLogger): EndpointReturn<typeof endpoints> {
  return useEndpoint(endpoints, {}, logger);
}

/**
 * Hook for deleting tasks
 * Uses the DELETE endpoint from taskEndpoints
 */
export function useDeleteCronTask(
  taskId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof taskEndpoints> {
  return useEndpoint(
    taskEndpoints,
    {
      urlPathParams: { id: taskId },
      queryOptions: {
        enabled: false, // Don't auto-fetch for delete operations
        refetchOnWindowFocus: false,
      },
    },
    logger,
  );
}

/**
 * Hook for toggling task enabled status
 * Uses the PUT endpoint from taskEndpoints to update the enabled field
 */
export function useToggleCronTask(
  taskId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof taskEndpoints> {
  return useEndpoint(
    taskEndpoints,
    {
      urlPathParams: { id: taskId },
      queryOptions: {
        enabled: false, // Don't auto-fetch for update operations
        refetchOnWindowFocus: false,
      },
    },
    logger,
  );
}
