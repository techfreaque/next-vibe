/**
 * Pulse Health Monitoring Hooks
 * Migrated from side-tasks-old/cron/pulse/hooks.ts
 * React hooks for pulse health functionality
 */

"use client";

import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import { pulseExecuteEndpoint, pulseStatusEndpoint } from "./definition";

/**
 * Hook for executing pulse cycles
 */
export const usePulseExecute = (logger: EndpointLogger) => {
  return useEndpoint(pulseExecuteEndpoint, {}, logger);
};

/**
 * Hook for fetching pulse health status
 */
export const usePulseStatus = (logger: EndpointLogger) => {
  return useEndpoint(pulseStatusEndpoint, {}, logger);
};
