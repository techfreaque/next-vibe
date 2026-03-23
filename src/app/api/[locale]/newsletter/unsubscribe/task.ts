/**
 * Newsletter Unsubscribe Sync Task
 * Pure metadata - dispatches to newsletter/unsubscribe/sync POST route via pulse runner.
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
    id: "newsletter-unsubscribe-sync",
    name: "unsubscribe.sync.post.title",
    description: "unsubscribe.sync.post.description",
    schedule: CRON_SCHEDULES.EVERY_6_HOURS,
    category: TaskCategory.MAINTENANCE,
    enabled: false,
    hidden: true,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.MEDIUM,
    taskInput: { dryRun: false, batchSize: 100 },
  },
);

export const tasks: Task[] = [newsletterUnsubscribeSyncTask];

export default tasks;
