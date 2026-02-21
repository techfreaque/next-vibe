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
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import {
  AUTH_TOKEN_COOKIE_MAX_AGE_DAYS,
  RESET_TOKEN_EXPIRY,
} from "@/config/constants";

import definitions from "./definition";
import { tools } from "./route";

const sessionCleanupTask = createCronTask(definitions.POST, tools.POST, {
  name: "user-session-cleanup",
  description: "app.api.user.session-cleanup.task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: {
    dryRun: false,
    batchSize: 200,
    sessionRetentionDays: AUTH_TOKEN_COOKIE_MAX_AGE_DAYS,
    tokenRetentionDays: RESET_TOKEN_EXPIRY,
  },
});

export const tasks: Task[] = [sessionCleanupTask];
export default tasks;
