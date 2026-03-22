"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { useCronTasksList } from "./tasks/hooks";
import type { CronTaskItem } from "./tasks/definition";
import { formatTasksSummary } from "./system-prompt/prompt";

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
  tasks: CronTaskItem[];
  tasksSummary: string;
  isLoading: boolean;
  error: string | null;
} {
  const { enabled, user, logger } = params;

  const shouldFetch = enabled && !user.isPublic;
  const tasksEndpoint = useCronTasksList(user, logger);

  const taskItems = useMemo((): CronTaskItem[] => {
    if (!shouldFetch || !tasksEndpoint.read?.response?.success) {
      return [];
    }
    return (tasksEndpoint.read.response.data?.tasks ?? []).map((t) => ({
      ...t,
      lastResultSummary: null,
      recentExecutions: null,
    }));
  }, [shouldFetch, tasksEndpoint.read?.response]);

  const tasksSummary = useMemo(
    () => (taskItems.length > 0 ? formatTasksSummary(taskItems) : ""),
    [taskItems],
  );

  return {
    tasks: taskItems,
    tasksSummary,
    isLoading: tasksEndpoint.isLoading,
    error: tasksEndpoint.error?.message ?? null,
  };
}
