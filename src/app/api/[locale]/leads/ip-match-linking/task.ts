/**
 * IP Match Linking Cron Task
 * Runs nightly to link anonymous leads sharing the same IP address.
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

const ipMatchLinkingTask = createCronTask(definitions.POST, tools.POST, {
  id: "leads-ip-match-linking",
  name: "post.title",
  description: "task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: { dryRun: false, windowDays: 30 },
});

export const tasks: Task[] = [ipMatchLinkingTask];

export default tasks;
