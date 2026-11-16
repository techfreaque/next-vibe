/**
 * Verify-Email Reminder Task
 * Hourly: accounts created 24-25 h before the current hour that are still
 * unverified get one reminder. Each signup falls into exactly one window.
 *
 * Production instance only (Atlas dev and Hermes preview never mail).
 */
import "server-only";

import { coreEnv } from "next-vibe/core/env";
import { Environment } from "next-vibe/env/env-util";
import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definitions from "./definition";
import { tools } from "./route";

const verifyEmailReminderTask = createCronTask(definitions.POST, tools.POST, {
  id: "verify-email-reminder",
  name: "task.name",
  description: "task.description",
  schedule: CRON_SCHEDULES.EVERY_HOUR,
  category: TaskCategory.MAINTENANCE,
  enabled:
    coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: { batchSize: 100, dryRun: false },
});

export const tasks: Task[] = [verifyEmailReminderTask];
export default tasks;
