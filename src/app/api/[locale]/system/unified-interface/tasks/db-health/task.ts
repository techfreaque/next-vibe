/**
 * Database Health Check Cron Task
 * Verifies the database connection is alive every minute.
 * Runs via the pulse runner like all other cron tasks.
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

const dbHealthTask: Task = {
  type: "cron",
  name: "db-health-check",
  routeId: "system_unified-interface_tasks_db-health_POST",
  description:
    "app.api.system.unifiedInterface.tasks.dbHealthCheck.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MONITORING,
  enabled: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.SHORT,
};

export const tasks: Task[] = [dbHealthTask];
export default tasks;
