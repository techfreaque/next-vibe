/**
 * Credit Expiration Cron Task
 * Expires old subscription credits daily
 */
import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import creditExpirationTaskDefinition from "./definition";
import { tools } from "./route";

const creditExpirationTask = createCronTask(
  creditExpirationTaskDefinition.POST,
  tools.POST,
  {
    id: "credits-expire",
    name: "expire.post.title",
    description: "expire.task.description",
    schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
    category: TaskCategory.MAINTENANCE,
    enabled: true,
    hidden: true,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.SHORT,
    taskInput: undefined,
  },
);

export const tasks: Task[] = [creditExpirationTask];
export default tasks;
