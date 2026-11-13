/**
 * Model Catalog Scan Cron Task
 * Daily pulse, real work every 5 days (the repository skips while the last
 * scan is younger). Diffs provider model lists and live prices against our
 * definitions, stores the report and mails it to the ops inboxes.
 *
 * Enabled by default on the production instance only (Atlas dev and Hermes
 * preview never mail). `enabled`, `schedule` and `taskInput` are DB-owned after the
 * first boot; toggle per instance with
 *   vibe cron-update --id=model-catalog-scan --enabled=true
 */

import "server-only";

import { coreEnv } from "next-vibe/core/env";
import { Environment } from "next-vibe/env/env-util";
import { TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import {
  MODEL_CATALOG_SCAN_CRON_ID,
  MODEL_CATALOG_SCAN_CRON_SCHEDULE,
} from "./constants";
import definitions from "./definition";
import { tools } from "./route";

const modelCatalogScanTask = createCronTask(definitions.POST, tools.POST, {
  id: MODEL_CATALOG_SCAN_CRON_ID,
  name: "task.name",
  description: "task.description",
  schedule: MODEL_CATALOG_SCAN_CRON_SCHEDULE,
  category: TaskCategory.MAINTENANCE,
  // Prod (Thea) only: NODE_ENV production without --hermes/--preview.
  enabled:
    coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE,
  hidden: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  // Skipped days are not news; only real scans matter.
  historyInterval: 24 * 60 * 60 * 1000,
  taskInput: { force: false, sendEmail: true },
});

export const tasks: Task[] = [modelCatalogScanTask];
export default tasks;
