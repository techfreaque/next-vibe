/**
 * Pulse Health Monitoring Hooks
 * Migrated from side-tasks-old/cron/pulse/hooks.ts
 * React hooks for pulse health functionality
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import pulseExecuteEndpoint from "@/app/api/[locale]/system/unified-interface/tasks/pulse/definition";
import pulseStatusEndpoint from "@/app/api/[locale]/system/unified-interface/tasks/pulse/status/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

/**
 * Hook for executing pulse cycles
 */
export function usePulseExecute(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof pulseExecuteEndpoint> {
  return useEndpoint(pulseExecuteEndpoint, undefined, logger, user);
}

/**
 * Hook for fetching pulse health status
 */
export function usePulseStatus(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof pulseStatusEndpoint> {
  return useEndpoint(pulseStatusEndpoint, undefined, logger, user);
}
