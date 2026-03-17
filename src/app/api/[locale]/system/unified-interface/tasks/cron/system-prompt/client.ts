"use client";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { useTasksSummary } from "@/app/api/[locale]/system/unified-interface/tasks/cron/use-tasks-summary";

import type { TasksData } from "./prompt";

export function useTasksData(params: SystemPromptClientParams): TasksData {
  const { tasks } = useTasksSummary({
    enabled: params.enabledPrivate,
    user: params.user,
    logger: params.logger,
  });
  return { tasks };
}
