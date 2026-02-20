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
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

const imapSyncTask: Task = {
  type: "cron",
  name: "imap-sync",
  routeId: "emails_imap-client_sync_POST",
  description: "app.api.system.unifiedInterface.tasks.imapSync.description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES,
  category: TaskCategory.SYSTEM,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.EXTENDED,
  defaultConfig: {
    maxAccountsPerRun: 10,
    enableFolderSync: true,
    enableMessageSync: true,
    dryRun: false,
  },
};

export const tasks: Task[] = [imapSyncTask];

export default tasks;
