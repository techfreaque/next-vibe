/**
 * Vibe Sense — Cron Tasks
 *
 * 1. Cleanup: Runs retention cleanup and evicts expired snapshots (daily)
 * 2. Graph Runner: Executes all due cron-triggered graphs (every 5 min)
 *
 * Both tasks share the cleanup endpoint — the handler runs retention, snapshot
 * eviction, and graph scheduling. Retention and snapshot eviction are cheap
 * (just DB queries), so running them every 5 min alongside scheduling is fine.
 */

import "server-only";

import {
  CRON_SCHEDULES,
  HISTORY_INTERVALS,
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

import cleanupDefinitions from "./cleanup/definition";
import { tools as cleanupTools } from "./cleanup/route";

const vibeSenseCleanupTask = createCronTask(
  cleanupDefinitions.POST,
  cleanupTools.POST,
  {
    id: "vibe-sense-cleanup",
    name: "cleanup.name",
    description: "cleanup.description",
    schedule: CRON_SCHEDULES.DAILY_6AM,
    category: TaskCategory.MAINTENANCE,
    enabled: true,
    hidden: true,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.MEDIUM,
    historyInterval: HISTORY_INTERVALS.EVERY_HOUR,
    taskInput: undefined,
  },
);

const vibeSenseGraphRunnerTask = createCronTask(
  cleanupDefinitions.POST,
  cleanupTools.POST,
  {
    id: "vibe-sense-graph-runner",
    name: "graphRunner.name",
    description: "graphRunner.description",
    schedule: CRON_SCHEDULES.EVERY_5_MINUTES,
    category: TaskCategory.MONITORING,
    enabled: true,
    hidden: true,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.MEDIUM,
    historyInterval: HISTORY_INTERVALS.EVERY_5_MINUTES,
    taskInput: undefined,
  },
);

export const tasks: Task[] = [vibeSenseCleanupTask, vibeSenseGraphRunnerTask];
export default tasks;
