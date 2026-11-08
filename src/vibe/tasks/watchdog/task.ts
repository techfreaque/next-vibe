/**
 * Task Watchdog Cron Task
 * Runs every minute on the pulse: stops stuck / looping / orphaned background
 * tasks and opens an incident for each.
 */

import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import { TASK_WATCHDOG_SELF_ID } from "./config";
import definitions from "./sweep/definition";
import { tools } from "./sweep/route";

const taskWatchdogTask = createCronTask(definitions.POST, tools.POST, {
  id: TASK_WATCHDOG_SELF_ID,
  name: "sweep.post.title",
  description: "sweep.task.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MONITORING,
  enabled: true,
  hidden: true,
  priority: CronTaskPriority.CRITICAL,
  timeout: TASK_TIMEOUTS.SHORT,
  // A clean minute is not news; failures are always logged
  historyInterval: 15 * 60 * 1000,
  taskInput: undefined,
});

export const tasks: Task[] = [taskWatchdogTask];
export default tasks;
