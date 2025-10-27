/**
 * Pulse Health Monitoring Hooks
 * Migrated from side-tasks-old/cron/pulse/hooks.ts
 * React hooks for pulse health functionality
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import { pulseExecuteEndpoint, pulseStatusEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/tasks/pulse/definition";

/**
 * Hook for executing pulse cycles
 */
export function usePulseExecute(
  logger: EndpointLogger,
): EndpointReturn<typeof pulseExecuteEndpoint> {
  return useEndpoint(pulseExecuteEndpoint, {}, logger);
}

/**
 * Hook for fetching pulse health status
 */
export function usePulseStatus(
  logger: EndpointLogger,
): EndpointReturn<typeof pulseStatusEndpoint> {
  return useEndpoint(pulseStatusEndpoint, {}, logger);
}
