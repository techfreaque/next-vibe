/**
 * Finance Cron Tasks
 * Read-only ingestion; costs no credits. Alerts are gated by the editable
 * thresholds (finance_thresholds), not by the schedule.
 *  - balances hourly: provider balance / spend snapshot (stolen-key detector)
 *  - revenue daily:   Stripe + NOWPayments pull, margin rollup, margin alerts
 *
 * Enabled by default on the production instance only: Atlas dev and Hermes use
 * Stripe test keys, so their alerts would describe test data. `enabled` is
 * DB-owned after the first boot; toggle per instance with
 *   vibe cron-update --id=finance-revenue-daily --enabled=false
 */

import "server-only";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import { IngestScope } from "../enum";
import { isFinanceProductionInstance } from "../env";
import definitions from "./definition";
import { tools } from "./route";

const financeBalancesTask = createCronTask(definitions.POST, tools.POST, {
  id: "finance-balances-hourly",
  name: "ingest.task.balancesName",
  description: "ingest.task.balances",
  schedule: CRON_SCHEDULES.EVERY_HOUR,
  category: TaskCategory.MONITORING,
  enabled: isFinanceProductionInstance,
  hidden: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM,
  // A clean hour is not news; failures are always logged
  historyInterval: 6 * 60 * 60 * 1000,
  taskInput: { scope: IngestScope.BALANCES, dryRun: false },
});

const financeRevenueTask = createCronTask(definitions.POST, tools.POST, {
  id: "finance-revenue-daily",
  name: "ingest.task.revenueName",
  description: "ingest.task.revenue",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.MONITORING,
  enabled: isFinanceProductionInstance,
  hidden: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG,
  taskInput: { scope: IngestScope.ALL, dryRun: false },
});

export const tasks: Task[] = [financeBalancesTask, financeRevenueTask];
export default tasks;
