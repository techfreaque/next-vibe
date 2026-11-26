import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definitions from "./definition";
import { tools } from "./route";

export const tasks: Task[] = [
  createCronTask(definitions.POST, tools.POST, {
    id: "system-mailbox-bills-intake",
    name: "syncTitle",
    description: "syncDescription",
    schedule: CRON_SCHEDULES.EVERY_HOUR,
    category: TaskCategory.SYSTEM,
    enabled: false,
    hidden: true,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.MEDIUM,
    taskInput: { dryRun: true, limit: 25 },
  }),
];
export default tasks;
