"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { useCronTasksList } from "./tasks/hooks";
import { formatTasksSummary } from "./tasks-formatter";

/**
 * Hook to fetch user cron tasks ONLY when needed (conditional)
 * Used in debug view to show tasks in system prompt
 *
 * IMPORTANT: This hook only fetches when enabled=true
 * This prevents unnecessary API calls when debug view is not active
 */
export function useTasksSummary(params: {
  enabled: boolean;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): {
  tasksSummary: string;
  isLoading: boolean;
  error: string | null;
} {
  const { enabled, user, logger } = params;

  const shouldFetch = enabled && !user.isPublic;
  const tasksEndpoint = useCronTasksList(user, logger);

  const tasksSummary = useMemo(() => {
    if (!shouldFetch) {
      return "";
    }

    if (!tasksEndpoint.read?.response?.success) {
      return "";
    }

    const tasks = tasksEndpoint.read.response.data?.tasks ?? [];
    return formatTasksSummary(
      tasks.map((t) => ({
        id: t.id,
        displayName: t.displayName,
        description: t.description,
        schedule: t.schedule,
        enabled: t.enabled,
        lastExecutionStatus: t.lastExecutionStatus,
        lastExecutedAt: t.lastExecutedAt,
        errorCount: t.errorCount,
        routeId: t.routeId,
        // Enriched fields — not available client-side, graceful defaults
        priority: t.priority ?? null,
        lastExecutionDuration: t.lastExecutionDuration ?? null,
        lastResultSummary: null,
        consecutiveFailures: t.consecutiveFailures ?? 0,
        recentExecutions: null,
      })),
    );
  }, [shouldFetch, tasksEndpoint.read?.response]);

  return {
    tasksSummary,
    isLoading: tasksEndpoint.isLoading,
    error: tasksEndpoint.error?.message ?? null,
  };
}
