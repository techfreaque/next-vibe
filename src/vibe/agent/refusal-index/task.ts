/**
 * Refusal Index weekly cron task.
 * Each week: the uncensored generator adds WEEKLY_NEW_QUESTIONS new
 * questions, then every (question, model) pair without an answer is filled,
 * including every pair of models added since the last run. Already answered
 * pairs are never asked again. Runs through the same start endpoint admins
 * use. DEFAULT DISABLED in code on purpose: `enabled`, `schedule` and
 * `taskInput` are DB-owned (the task seed never overwrites them), so the
 * switch lives in the DB, per instance:
 *
 *   vibe cron-update --id=refusal-index-weekly --enabled=true \
 *     --taskInput='{"newQuestions":10,"budgetCredits":1000,"dryRun":false,"wait":false}'
 *
 * (prod: same command with `--hermes --thea`). A run that hits its cap stops
 * cleanly; its answers count, the rest are filled next week. Size the cap
 * with `vibe refusal-index-run --dryRun=true --newQuestions=10`.
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
  WEEKLY_NEW_QUESTIONS,
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
    // Default OFF - an admin enables it per instance (see above).
    enabled: false,
    priority: CronTaskPriority.LOW,
    timeout: TASK_TIMEOUTS.MEDIUM,
    historyInterval: HISTORY_INTERVALS.EVERY_RUN,
    taskInput: {
      newQuestions: WEEKLY_NEW_QUESTIONS,
      budgetCredits: DEFAULT_BUDGET_CREDITS,
      dryRun: false,
      wait: false,
    },
  },
);

export const tasks: Task[] = [refusalIndexWeeklyTask];
export default tasks;
