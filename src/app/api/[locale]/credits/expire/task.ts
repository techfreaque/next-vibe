/**
 * Credit Expiration Cron Task
 * Expires old subscription credits daily
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

const creditExpirationTask: Task = {
  type: "cron",
  name: "credit-expiration",
  routeId: "credits_expire_POST",
  description: "app.api.agent.chat.credits.expire.task.description",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.SHORT,
};

export const tasks: Task[] = [creditExpirationTask];
export default tasks;
