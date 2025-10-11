/**
 * Cron Tasks List Hooks
 * Migrated from side-tasks-old/cron/tasks/hooks.ts
 * React hooks for cron tasks list functionality
 */

"use client";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "../../../unified-ui/react/hooks/endpoint";
import { useEndpoint } from "../../../unified-ui/react/hooks/endpoint";
import { endpoints } from "./definition";

/**
 * Hook for fetching cron tasks list
 */
export function useCronTasksList(
  logger: EndpointLogger,
): EndpointReturn<typeof endpoints.GET> {
  return useEndpoint(endpoints.GET, {}, logger);
}
