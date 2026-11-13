/**
 * Stale Run Reaper Cron Task
 * Every 5 minutes: frees chat threads left 'streaming' by a process that died
 * mid-answer. The first pulse after boot runs it too, so threads orphaned by
 * the restart itself are freed once their heartbeat is past the threshold
 * (the threshold is the grace period: a run that was live before the restart
 * on the peer node keeps beating and is never touched).
 */

import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import {
  STALE_RUN_BATCH_SIZE,
  STALE_RUN_LOCAL_THRESHOLD_MINUTES,
  STALE_RUN_REMOTE_THRESHOLD_MINUTES,
} from "./constants";
import definitions from "./definition";
import { tools } from "./route";

const staleRunReaperTask = createCronTask(definitions.POST, tools.POST, {
  id: "stale-run-reaper",
  name: "task.name",
  description: "task.description",
  schedule: CRON_SCHEDULES.EVERY_5_MINUTES,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  hidden: true,
  priority: CronTaskPriority.HIGH,
  timeout: TASK_TIMEOUTS.MEDIUM,
  // A clean sweep is not news; reaps are logged as warnings.
  historyInterval: 60 * 60 * 1000,
  taskInput: {
    localThresholdMinutes: STALE_RUN_LOCAL_THRESHOLD_MINUTES,
    remoteThresholdMinutes: STALE_RUN_REMOTE_THRESHOLD_MINUTES,
    batchSize: STALE_RUN_BATCH_SIZE,
    dryRun: false,
  },
});

export const tasks: Task[] = [staleRunReaperTask];
export default tasks;
