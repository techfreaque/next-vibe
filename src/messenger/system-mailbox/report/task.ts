/**
 * Daily Status Report Cron Task
 * Replaces the external shell script: composes the last-24h platform report
 * and mails it from the platform mailbox. Disabled by default - enable it
 * after THEA_MAIL_* is configured (set THEA_MAIL_REPORT_TO for the recipient).
 */
import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definitions from "./definition";
import { tools } from "./route";

const dailyStatusReportTask = createCronTask(definitions.POST, tools.POST, {
  id: "system-mailbox-daily-report",
  name: "report.title",
  description: "task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.SYSTEM,
  enabled: false,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: { dryRun: false },
});

export const tasks: Task[] = [dailyStatusReportTask];

export default tasks;
