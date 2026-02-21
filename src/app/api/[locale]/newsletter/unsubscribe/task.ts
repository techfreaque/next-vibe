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
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import definitions from "./sync/definition";
import { tools } from "./sync/route";

const newsletterUnsubscribeSyncTask = createCronTask(
  definitions.POST,
  tools.POST,
  {
    name: "newsletter-unsubscribe-sync",
    description:
      "app.api.system.unifiedInterface.tasks.newsletterUnsubscribeSync.description",
    schedule: CRON_SCHEDULES.EVERY_6_HOURS,
    category: TaskCategory.MAINTENANCE,
    enabled: false,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.MEDIUM,
    defaultInput: { batchSize: 500, dryRun: false },
  },
);

export const tasks: Task[] = [newsletterUnsubscribeSyncTask];

export default tasks;
