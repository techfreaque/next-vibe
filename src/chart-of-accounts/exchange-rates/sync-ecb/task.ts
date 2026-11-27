import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import definition from "./definition";
import { tools } from "./route";

export const tasks: Task[] = [
  createCronTask(definition.POST, tools.POST, {
    id: "ecb-exchange-rates-sync",
    name: "sync.title",
    description: "sync.description",
    category: TaskCategory.SYSTEM,
    schedule: CRON_SCHEDULES.DAILY_6AM,
    enabled: true,
    hidden: false,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.SHORT,
    taskInput: undefined,
  }),
];

export default tasks;
