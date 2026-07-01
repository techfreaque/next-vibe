/**
 * Cron Tasks Hooks
 * React hooks for cron tasks operations
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import taskEndpoints from "next-vibe/tasks/cron/[id]/definition";

import { endpoints } from "./definition";

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
      create: {
        urlPathParams: { id: params.taskId },
      },
      delete: {
        urlPathParams: { id: params.taskId },
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
      create: {
        urlPathParams: { id: taskId },
      },
      delete: {
        urlPathParams: { id: taskId },
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
      create: {
        urlPathParams: { id: taskId },
      },
      delete: {
        urlPathParams: { id: taskId },
      },
    },
    logger,
    user,
  );
}
