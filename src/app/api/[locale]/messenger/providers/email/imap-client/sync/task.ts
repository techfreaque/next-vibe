/**
 * IMAP Sync Task
 * Pure metadata - dispatches to emails/imap-client/sync POST route via pulse runner.
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

const imapSyncTask = createCronTask(definitions.POST, tools.POST, {
  id: "imap-sync",
  name: "title",
  description: "description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES,
  category: TaskCategory.SYSTEM,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.EXTENDED,
  taskInput: {
    dryRun: false,
    force: false,
    maxMessages: 100,
    accountIds: ["add-uuid-of-an-imap-account-here"],
  },
  hidden: true,
});

export const tasks: Task[] = [imapSyncTask];

export default tasks;
