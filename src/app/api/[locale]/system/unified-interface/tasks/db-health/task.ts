/**
 * Database Health Check Cron Task
 * Verifies the database connection is alive every minute.
 * Runs via the pulse runner like all other cron tasks.
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

const dbHealthTask = createCronTask(definitions.POST, tools.POST, {
  id: "db-health",
  name: "dbHealthCheck.name",
  description: "dbHealthCheck.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MONITORING,
  enabled: true,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.SHORT,
  historyInterval: HISTORY_INTERVALS.EVERY_30_MINUTES,
  taskInput: undefined,
});

export const tasks: Task[] = [dbHealthTask];
export default tasks;
