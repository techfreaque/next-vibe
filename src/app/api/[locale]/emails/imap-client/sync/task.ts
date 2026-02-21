/**
 * IMAP Sync Task
 * Pure metadata — dispatches to emails/imap-client/sync POST route via pulse runner.
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

import definitions from "./definition";
import { tools } from "./route";

const imapSyncTask = createCronTask(definitions.POST, tools.POST, {
  name: "imap-sync",
  description: "app.api.system.unifiedInterface.tasks.imapSync.description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES,
  category: TaskCategory.SYSTEM,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.EXTENDED,
  taskInput: {
    dryRun: false,
    force: false,
    maxMessages: 100,
    accountIds: ["add-uuid-of-an-imap-account-here"],
  },
});

export const tasks: Task[] = [imapSyncTask];

export default tasks;
