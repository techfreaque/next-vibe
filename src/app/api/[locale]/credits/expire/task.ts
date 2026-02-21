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
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import creditExpirationTaskDefinition from "./definition";
import { tools } from "./route";

const creditExpirationTask = createCronTask(
  creditExpirationTaskDefinition.POST,
  tools.POST,
  {
    name: "credit-expiration",
    description: "app.api.agent.chat.credits.expire.task.description",
    schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
    category: TaskCategory.MAINTENANCE,
    enabled: true,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.SHORT,
  },
);

export const tasks: Task[] = [creditExpirationTask];
export default tasks;
