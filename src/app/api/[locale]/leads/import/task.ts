/**
 * CSV Processor Task
 * Pure metadata — dispatches to leads/import/process POST route via pulse runner.
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

const csvProcessorTask: Task = {
  type: "cron",
  name: "csv-processor",
  routeId: "leads_import_process_POST",
  description: "app.api.system.unifiedInterface.tasks.csvProcessor.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG,
  defaultConfig: { maxJobsPerRun: 5, maxRetriesPerJob: 3, dryRun: false },
};

export const tasks: Task[] = [csvProcessorTask];

export default tasks;
