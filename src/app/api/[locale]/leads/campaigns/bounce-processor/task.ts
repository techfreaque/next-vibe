/**
 * Bounce Processor Task
 * Cron task that scans IMAP for bounce notifications and updates lead status.
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

const bounceProcessorTask = createCronTask(definitions.POST, tools.POST, {
  id: "bounce-processor",
  name: "post.title",
  description: "task.description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: { dryRun: false, batchSize: 100 },
});

export const tasks: Task[] = [bounceProcessorTask];

export default tasks;
