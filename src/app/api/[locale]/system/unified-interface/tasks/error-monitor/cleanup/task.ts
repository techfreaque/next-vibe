/**
 * Error Logs Cleanup Cron Task
 * Prunes error_logs older than 7 days. Runs daily at midnight.
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

import definitions from "./definition";
import { tools } from "./route";

const errorLogsCleanupTask = createCronTask(definitions.POST, tools.POST, {
  id: "error-logs-cleanup",
  name: "errorMonitor.cleanup.name",
  description: "errorMonitor.cleanup.description",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.SHORT,
  taskInput: undefined,
});

export const tasks: Task[] = [errorLogsCleanupTask];
export default tasks;
