/**
 * Cron Tasks Hooks
 * React hooks for cron tasks operations
 */

"use client";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "../../../unified-ui/react/hooks/endpoint";
import { useEndpoint } from "../../../unified-ui/react/hooks/endpoint";
import { endpoints as taskEndpoints } from "../task/[id]/definition";
import { useCronTask } from "../task/[id]/hooks";
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

// Stub hook for creating tasks
export function useCreateCronTask(): {
  create: { onSubmit: null; form: null };
} {
  console.warn("useCreateCronTask: Create task endpoint not yet implemented");
  return {
    create: { onSubmit: null, form: null },
  };
}

// Stub hook for deleting tasks
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDeleteCronTask(taskId: string): {
  mutateAsync: (data: unknown) => Promise<void>;
} {
  console.warn("useDeleteCronTask: Delete task endpoint not yet implemented");
  return {
    mutateAsync: async () => {
      throw new Error("Delete task endpoint not yet implemented");
    },
  };
}

// Stub hook for toggling task enabled status
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useToggleCronTask(taskId: string): {
  mutateAsync: (enabled: boolean) => Promise<void>;
} {
  console.warn("useToggleCronTask: Toggle task endpoint not yet implemented");
  return {
    mutateAsync: async () => {
      throw new Error("Toggle task endpoint not yet implemented");
    },
  };
}
