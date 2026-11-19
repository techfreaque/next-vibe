import "server-only";

import {
  CRON_SCHEDULES,
  HISTORY_INTERVALS,
  TASK_TIMEOUTS,
} from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definitions from "./definition";
import { isSignupBounceProductionInstance } from "./repository";
import { tools } from "./route";

export const tasks: Task[] = [
  createCronTask(definitions.POST, tools.POST, {
    id: "signup-bounce-sync",
    name: "bounceSync.title",
    description: "bounceSync.description",
    schedule: CRON_SCHEDULES.EVERY_MINUTE,
    category: TaskCategory.SYSTEM,
    enabled: isSignupBounceProductionInstance,
    hidden: true,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.SHORT,
    historyInterval: HISTORY_INTERVALS.EVERY_HOUR,
    taskInput: undefined,
  }),
];

export default tasks;
