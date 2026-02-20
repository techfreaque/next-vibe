/**
 * Newsletter Unsubscribe Sync Task
 * Pure metadata — dispatches to newsletter/unsubscribe/sync POST route via pulse runner.
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

const newsletterUnsubscribeSyncTask: Task = {
  type: "cron",
  name: "newsletter-unsubscribe-sync",
  routeId: "newsletter_unsubscribe_sync_POST",
  description:
    "app.api.system.unifiedInterface.tasks.newsletterUnsubscribeSync.description",
  schedule: CRON_SCHEDULES.EVERY_6_HOURS,
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  defaultConfig: { batchSize: 500, dryRun: false },
};

export const tasks: Task[] = [newsletterUnsubscribeSyncTask];

export default tasks;
