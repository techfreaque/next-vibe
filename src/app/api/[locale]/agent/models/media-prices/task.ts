/**
 * Media Model Prices Update Task
 * Fetches live prices from provider APIs and updates models.ts.
 * Dev-only — runs once a week.
 */

import "server-only";

import { env } from "@/config/env";

import { Environment } from "../../../shared/utils";
import {
  CRON_SCHEDULES,
  HISTORY_INTERVALS,
  TASK_TIMEOUTS,
} from "../../../system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "../../../system/unified-interface/tasks/enum";
import {
  createCronTask,
  type Task,
} from "../../../system/unified-interface/tasks/unified-runner/types";
import definitions from "./definition";
import { tools } from "./route";

const mediaPricesTask = createCronTask(definitions.GET, tools.GET, {
  id: "update-media-model-prices",
  name: "updateMediaModelPrices.name" as const,
  description: "updateMediaModelPrices.description" as const,
  schedule: CRON_SCHEDULES.WEEKLY_MONDAY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: env.NODE_ENV === Environment.DEVELOPMENT,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  historyInterval: HISTORY_INTERVALS.EVERY_RUN,
  taskInput: undefined,
});

export const tasks: Task[] = [mediaPricesTask];
export default tasks;
