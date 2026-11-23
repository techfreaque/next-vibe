/**
 * Signup Reminder Task
 * Every 30 minutes: pending signups still unconfirmed 2 hours after their last
 * confirmation email get one reminder with a fresh code and a 24 h link.
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

const signupReminderTask = createCronTask(definitions.POST, tools.POST, {
  id: "signup-reminder",
  name: "task.name",
  description: "task.description",
  schedule: CRON_SCHEDULES.EVERY_30_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled:
    coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: { batchSize: 50, dryRun: false },
});

export const tasks: Task[] = [signupReminderTask];
export default tasks;
