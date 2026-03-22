import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import type { TasksData } from "./prompt";

export async function loadTasksData(
  params: SystemPromptServerParams,
): Promise<TasksData> {
  const { user, logger, isIncognito, isExposedFolder } = params;
  const userId = user.isPublic ? undefined : user.id;

  if (isIncognito || isExposedFolder || !userId) {
    return { tasks: [] };
  }

  try {
    const { CronTasksRepository } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/cron/repository");
    const tasks = await CronTasksRepository.loadTaskItems({
      userId,
      logger,
    });
    return { tasks };
  } catch (error) {
    logger.error("Failed to load tasks for system prompt", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { tasks: [] };
  }
}
