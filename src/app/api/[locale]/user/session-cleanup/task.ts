/**
 * Session Cleanup Task
 * Handles background session and token cleanup using the proper task system
 */
import "server-only";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

const sessionCleanupTask: Task = {
  type: "cron",
  name: "user-session-cleanup",
  routeId: "user_session-cleanup_POST",
  description: "app.api.user.session-cleanup.task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM,
};

export const tasks: Task[] = [sessionCleanupTask];
export default tasks;
