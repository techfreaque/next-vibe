/**
 * Yearly Credits Cron Task
 * Daily: yearly plans get this month's credits (idempotent per month)
 */
import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import yearlyCreditsDefinition from "./definition";
import { tools } from "./route";

const yearlyCreditsTask = createCronTask(
  yearlyCreditsDefinition.POST,
  tools.POST,
  {
    id: "subscription-yearly-monthly-credits",
    name: "post.title",
    description: "task.description",
    schedule: CRON_SCHEDULES.DAILY_6AM,
    category: TaskCategory.MAINTENANCE,
    enabled: true,
    hidden: true,
    priority: CronTaskPriority.HIGH,
    timeout: TASK_TIMEOUTS.SHORT,
    taskInput: undefined,
  },
);

export const tasks: Task[] = [yearlyCreditsTask];
export default tasks;
