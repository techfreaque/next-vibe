/**
 * Unified Model Prices Update Task
 * Fetches live prices from ALL provider APIs and updates models.ts.
 * Runs weekly - replaces the separate media-prices and openrouter tasks.
 */

import "server-only";

import { coreEnv } from "next-vibe/core/env";
import { Environment } from "next-vibe/env/env-util";
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
import { tools } from "./route";

const modelPricesTask = createCronTask(definitions.GET, tools.GET, {
  id: "update-all-model-prices",
  name: "updateAllModelPrices.name" as const,
  description: "updateAllModelPrices.description" as const,
  schedule: CRON_SCHEDULES.WEEKLY_MONDAY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: coreEnv.NODE_ENV === Environment.DEVELOPMENT,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  historyInterval: HISTORY_INTERVALS.EVERY_RUN,
  taskInput: undefined,
  hidden: true,
});

export const tasks: Task[] = [modelPricesTask];
export default tasks;
