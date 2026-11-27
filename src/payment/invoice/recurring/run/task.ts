import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definition from "./definition";
import { tools } from "./route";

/**
 * Daily cron task for recurring invoices.
 * Safe to run globally because `runDueRecurringInvoices` strictly skips every company
 * whose `company_payment_settings.recurring_invoices_enabled` is false (default false).
 */
export const tasks: Task[] = [
  createCronTask(definition.POST, tools.POST, {
    id: "recurring-invoices-runner",
    name: "recurring.cronName",
    description: "recurring.cronDescription",
    category: TaskCategory.SYSTEM,
    schedule: CRON_SCHEDULES.DAILY_6AM,
    enabled: true,
    hidden: false,
    priority: CronTaskPriority.MEDIUM,
    timeout: TASK_TIMEOUTS.LONG,
    taskInput: { dryRun: false },
  }),
];

export default tasks;
