/**
 * Referral Earnings Confirm Cron Task
 * Daily: earnings older than the refund window become spendable earned credits
 */
import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import referralEarningsConfirmDefinition from "./definition";
import { tools } from "./route";

const referralEarningsConfirmTask = createCronTask(
  referralEarningsConfirmDefinition.POST,
  tools.POST,
  {
    id: "referral-earnings-confirm",
    name: "earnings.confirm.post.title",
    description: "earnings.confirm.task.description",
    schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
    category: TaskCategory.MAINTENANCE,
    enabled: true,
    hidden: true,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.SHORT,
    taskInput: undefined,
  },
);

export const tasks: Task[] = [referralEarningsConfirmTask];
export default tasks;
