/**
 * Guest Media Cleanup Cron Task
 * Deletes guest media (leads never linked to an account) older than the
 * retention window. Runs daily.
 */

import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import {
  GUEST_MEDIA_BATCH_SIZE,
  GUEST_MEDIA_RETENTION_DAYS,
} from "./constants";
import definitions from "./definition";
import { tools } from "./route";

const guestMediaCleanupTask = createCronTask(definitions.POST, tools.POST, {
  id: "guest-media-cleanup",
  name: "task.name",
  description: "task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: {
    retentionDays: GUEST_MEDIA_RETENTION_DAYS,
    batchSize: GUEST_MEDIA_BATCH_SIZE,
    dryRun: false,
  },
});

export const tasks: Task[] = [guestMediaCleanupTask];
export default tasks;
