/**
 * URL Cache Cleanup Cron Task
 * Prunes stale URL fetch cache files older than 7 days. Runs weekly.
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

const urlCacheCleanupTask = createCronTask(definitions.POST, tools.POST, {
  id: "url-cache-cleanup",
  name: "cleanup.name",
  description: "cleanup.description",
  schedule: CRON_SCHEDULES.WEEKLY_SUNDAY_MIDNIGHT,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.SHORT,
  taskInput: undefined,
});

export const tasks: Task[] = [urlCacheCleanupTask];
export default tasks;
