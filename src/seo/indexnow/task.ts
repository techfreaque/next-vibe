/**
 * IndexNow submit cron task.
 * Hourly and idempotent: a run with no new or changed sitemap URL sends
 * nothing, so a deploy that adds pages gets pinged within the hour.
 *
 * Enabled by default on the production instance only. `enabled`, `schedule`
 * and `taskInput` are DB-owned after the first boot; toggle per instance with
 *   vibe cron-update --id=indexnow-submit --enabled=true
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

import { INDEXNOW_CRON_ID } from "./constants";
import definitions from "./definition";
import { tools } from "./route";

const indexNowTask = createCronTask(definitions.POST, tools.POST, {
  id: INDEXNOW_CRON_ID,
  name: "post.title",
  description: "task.description",
  schedule: CRON_SCHEDULES.EVERY_HOUR,
  category: TaskCategory.MAINTENANCE,
  // Prod (Thea) only: NODE_ENV production without --hermes/--preview.
  enabled:
    coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  // Unchanged runs are not news; keep one history row a day.
  historyInterval: 24 * 60 * 60 * 1000,
  taskInput: { force: false, dryRun: false },
});

export const tasks: Task[] = [indexNowTask];
export default tasks;
