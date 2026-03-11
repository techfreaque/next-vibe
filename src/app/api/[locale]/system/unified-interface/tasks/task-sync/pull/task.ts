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
import { env } from "@/config/env";

import endpoints from "./definition";
import { tools } from "./route";

const syncTask = createCronTask(endpoints.POST, tools.POST, {
  id: "task-sync-pull",
  name: "taskSync.name",
  description: "taskSync.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.SYSTEM,
  // Always enabled — pullFromRemote skips when no active user connections exist,
  // and skips outbound sync on NEXT_PUBLIC_VIBE_IS_CLOUD instances.
  enabled: !env.NEXT_PUBLIC_VIBE_IS_CLOUD,
  hidden: true,
  priority: CronTaskPriority.HIGH,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: undefined,
});

export const tasks: Task[] = [syncTask];
export default tasks;
