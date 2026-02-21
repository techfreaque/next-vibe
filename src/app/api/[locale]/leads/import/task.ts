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
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import definitions from "./process/definition";
import { tools } from "./process/route";

const csvProcessorTask = createCronTask(definitions.POST, tools.POST, {
  name: "csv-processor",
  description: "app.api.system.unifiedInterface.tasks.csvProcessor.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG,
  taskInput: { dryRun: false, maxJobsPerRun: 1, maxRetriesPerJob: 0 },
});

export const tasks: Task[] = [csvProcessorTask];

export default tasks;
