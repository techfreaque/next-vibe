/**
 * Error Monitor Cron Task
 * Scans chat messages for error patterns every 3 hours.
 * Privacy-first: aggregates error types without reading content.
 */

import "server-only";

import {
  CRON_SCHEDULES,
  HISTORY_INTERVALS,
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

const errorMonitorTask = createCronTask(definitions.POST, tools.POST, {
  id: "error-monitor",
  name: "errorMonitor.name",
  description: "errorMonitor.description",
  schedule: CRON_SCHEDULES.EVERY_3_HOURS,
  category: TaskCategory.MONITORING,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM,
  historyInterval: HISTORY_INTERVALS.EVERY_HOUR,
  taskInput: undefined,
});

export const tasks: Task[] = [errorMonitorTask];
export default tasks;
