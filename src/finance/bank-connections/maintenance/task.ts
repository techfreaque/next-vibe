import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import { isFinanceProductionInstance } from "../../env";
import definition from "./definition";
import { tools } from "./route";

export const tasks: Task[] = [
  createCronTask(definition.POST, tools.POST, {
    id: "bank-feed-maintenance",
    name: "maintenance",
    description: "maintenanceHint",
    category: TaskCategory.SYSTEM,
    schedule: CRON_SCHEDULES.DAILY_6AM,
    enabled: isFinanceProductionInstance,
    hidden: true,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.LONG,
    taskInput: undefined,
  }),
];
export default tasks;
