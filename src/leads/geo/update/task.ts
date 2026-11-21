/**
 * Geo IP update cron task.
 * Hourly: downloads the DB-IP country release once per month (the repository
 * skips while the stored release is current) and resolves the country of up
 * to GEO_BACKFILL_BATCH leads per run that have an IP but no country yet.
 */
import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import { GEO_UPDATE_CRON_ID } from "./constants";
import definitions from "./definition";
import { tools } from "./route";

const geoUpdateTask = createCronTask(definitions.POST, tools.POST, {
  id: GEO_UPDATE_CRON_ID,
  name: "update.post.title",
  description: "update.task.description",
  schedule: CRON_SCHEDULES.EVERY_HOUR,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  historyInterval: 24 * 60 * 60 * 1000,
  taskInput: { force: false },
});

export const tasks: Task[] = [geoUpdateTask];
export default tasks;
