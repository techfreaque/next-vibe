/**
 * Refusal Index weekly cron task.
 * Starts (or resumes) a benchmark run through the same start endpoint admins
 * use. DEFAULT DISABLED in code on purpose: `enabled`, `schedule` and
 * `taskInput` are DB-owned (the task seed never overwrites them), so the
 * switch lives in the DB, per instance:
 *
 *   vibe cron-update --id=refusal-index-weekly --enabled=true \
 *     --taskInput='{"budgetCredits":4000,"dryRun":false,"wait":false}'
 *
 * (prod: same command with `--hermes --remote`). The budget must cover a FULL
 * run: a run that hits its cap ends cancelled and is never published. Size it
 * with `vibe refusal-index-run --dryRun=true` (real spend ran ~1.5x the
 * estimate in testing).
 */

import "server-only";

import { HISTORY_INTERVALS, TASK_TIMEOUTS } from "next-vibe/tasks/constants";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import {
  createCronTask,
  type Task,
} from "next-vibe/tasks/unified-runner/types";

import {
  DEFAULT_BUDGET_CREDITS,
  REFUSAL_INDEX_CRON_ID,
  REFUSAL_INDEX_CRON_SCHEDULE,
} from "./constants";
import startDefinitions from "./runs/start/definition";
import { tools as startTools } from "./runs/start/route";

const refusalIndexWeeklyTask = createCronTask(
  startDefinitions.POST,
  startTools.POST,
  {
    id: REFUSAL_INDEX_CRON_ID,
    name: "start.cron.name" as const,
    description: "start.cron.description" as const,
    schedule: REFUSAL_INDEX_CRON_SCHEDULE,
    category: TaskCategory.MAINTENANCE,
    // Default OFF - an admin enables it once the question set exists.
    enabled: false,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.MEDIUM,
    historyInterval: HISTORY_INTERVALS.EVERY_RUN,
    taskInput: {
      budgetCredits: DEFAULT_BUDGET_CREDITS,
      dryRun: false,
      wait: false,
    },
  },
);

export const tasks: Task[] = [refusalIndexWeeklyTask];
export default tasks;
