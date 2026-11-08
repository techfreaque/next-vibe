/**
 * Lifecycle journeys cron task.
 * Enrolls newly eligible contacts and sends due steps. The global kill switch
 * (lifecycle_settings.paused) defaults to PAUSED, so nothing is enrolled or sent
 * until an admin turns it off.
 */
import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definitions from "./run/definition";
import { tools } from "./run/route";

const lifecycleRunTask = createCronTask(definitions.POST, tools.POST, {
  id: "leads-lifecycle-run",
  name: "run.post.title",
  description: "run.post.description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  hidden: false,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: { dryRun: false },
});

export const tasks: Task[] = [lifecycleRunTask];

export default tasks;
