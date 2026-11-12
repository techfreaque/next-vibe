/**
 * Newsletter blast cron task (one-shot).
 *
 * Fires once at the next 08:00 UTC after the task row is created (runOnce is
 * anchored on createdAt, never at boot), enqueues the consent-filtered
 * November 2026 newsletter and disables itself. It only ENQUEUES: to mail the
 * rows, run the endpoint with send=true (`vibe newsletter-blast --send=true`)
 * or enable the email-campaigns dispatcher.
 *
 * To re-arm for a future issue: bump BLAST_JOURNEY_VARIANT in repository.ts,
 * change this task id, and set enabled: true again.
 */
import "server-only";

import { TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definitions from "./definition";
import { tools } from "./route";

/* eslint-disable i18next/no-literal-string */
const newsletterBlastTask = createCronTask(definitions.POST, tools.POST, {
  id: "newsletter-nov-2026-blast",
  name: "post.title",
  description: "post.description",
  // 08:00 UTC = 09:00 Europe/Vienna. runOnce fires at the next occurrence
  // after deploy (tomorrow morning) and then disables.
  schedule: "0 8 * * *",
  category: TaskCategory.LEAD_MANAGEMENT,
  enabled: true,
  hidden: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG,
  runOnce: true,
  taskInput: { dryRun: false, send: false },
});
/* eslint-enable i18next/no-literal-string */

export const tasks: Task[] = [newsletterBlastTask];

export default tasks;
