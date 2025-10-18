/**
 * Cron Tasks Hooks
 * React hooks for cron tasks operations
 */

"use client";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "../../../unified-ui/react/hooks/endpoint";
import { useEndpoint } from "../../../unified-ui/react/hooks/endpoint";
import { endpoints as taskEndpoints } from "../task/[id]/definition";
import { endpoints } from "./definition";

/**
 * Hook for fetching cron tasks list
 */
export function useCronTasksList(
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints> {
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
      urlParams: { id: params.taskId },
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
export function useCreateCronTask(
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints> {
  return useEndpoint(endpoints, {}, logger);
}

/**
 * Stub hook for deleting tasks
 * TODO: Implement when delete endpoint is available
 */
export function useDeleteCronTask(_taskId: string): {
  mutateAsync: () => Promise<void>;
} {
  return {
    mutateAsync: (): Promise<void> => {
      // No-op stub - endpoint not yet implemented
      return Promise.resolve();
    },
  };
}

/**
 * Stub hook for toggling task enabled status
 * TODO: Implement when toggle endpoint is available
 */
export function useToggleCronTask(_taskId: string): {
  mutateAsync: (_enabled: boolean) => Promise<void>;
} {
  return {
    mutateAsync: (_enabled: boolean): Promise<void> => {
      // No-op stub - endpoint not yet implemented
      return Promise.resolve();
    },
  };
}
