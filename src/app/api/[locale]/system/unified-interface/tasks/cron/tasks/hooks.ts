/**
 * Cron Tasks Hooks
 * React hooks for cron tasks operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import taskEndpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/definition";
import { endpoints } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

/**
 * Hook for fetching cron tasks list
 */
export function useCronTasksList(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints> {
  return useEndpoint(endpoints, undefined, logger, user);
}

/**
 * Hook for individual task operations (GET/PUT/DELETE)
 * Provides form handling and mutation capabilities for a single task
 */
export function useCronTaskEndpoint(
  user: JwtPayloadType,
  params: {
    taskId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): EndpointReturn<typeof taskEndpoints> {
  return useEndpoint(
    taskEndpoints,
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

/**
 * Hook for creating new cron tasks
 * Provides form handling and mutation capabilities for task creation
 */
export function useCreateCronTask(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints> {
  return useEndpoint(endpoints, undefined, logger, user);
}

/**
 * Hook for deleting tasks
 * Uses the DELETE endpoint from taskEndpoints
 */
export function useDeleteCronTask(
  user: JwtPayloadType,
  taskId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof taskEndpoints> {
  return useEndpoint(
    taskEndpoints,
    {
      read: {
        urlPathParams: { id: taskId },
        queryOptions: {
          enabled: false,
          refetchOnWindowFocus: false,
        },
      },
    },
    logger,
    user,
  );
}

/**
 * Hook for toggling task enabled status
 * Uses the PUT endpoint from taskEndpoints to update the enabled field
 */
export function useToggleCronTask(
  user: JwtPayloadType,
  taskId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof taskEndpoints> {
  return useEndpoint(
    taskEndpoints,
    {
      read: {
        urlPathParams: { id: taskId },
        queryOptions: {
          enabled: false,
          refetchOnWindowFocus: false,
        },
      },
    },
    logger,
    user,
  );
}
