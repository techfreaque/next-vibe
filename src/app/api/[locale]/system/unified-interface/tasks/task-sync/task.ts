/**
 * Task Sync Cron Task
 *
 * Periodically pulls new tasks from remote Thea instance.
 * Also retries pushing any unsynced completions (failed fire-and-forget pushes).
 */

import "server-only";

import {
  CRON_SCHEDULES,
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

import endpoints from "./pull/definition";
import { tools } from "./pull/route";

const syncTask = createCronTask(endpoints.POST, tools.POST, {
  name: "task-sync",
  description: "app.api.system.unifiedInterface.tasks.taskSync.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.SYSTEM,
  enabled: true,
  priority: CronTaskPriority.HIGH,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: undefined,
});

export const tasks: Task[] = [syncTask];
export default tasks;
