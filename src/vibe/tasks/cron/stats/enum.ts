/**
 * Task health enums (cron-stats report).
 * Classification rules live in ../health-summary.ts.
 */

import { createEnumOptions } from "../../../unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

/** One health state per task, most urgent first. */
export const {
  enum: TaskHealth,
  options: TaskHealthOptions,
  Value: TaskHealthValue,
} = createEnumOptions(scopedTranslation, {
  STUCK: "enums.taskHealth.stuck",
  FAILING: "enums.taskHealth.failing",
  OVERDUE: "enums.taskHealth.overdue",
  FLAKY: "enums.taskHealth.flaky",
  RECOVERING: "enums.taskHealth.recovering",
  RUNNING: "enums.taskHealth.running",
  LOW_DATA: "enums.taskHealth.lowData",
  NEVER_RAN: "enums.taskHealth.neverRan",
  HEALTHY: "enums.taskHealth.healthy",
  DISABLED: "enums.taskHealth.disabled",
});

export const TaskHealthDB = [
  TaskHealth.STUCK,
  TaskHealth.FAILING,
  TaskHealth.OVERDUE,
  TaskHealth.FLAKY,
  TaskHealth.RECOVERING,
  TaskHealth.RUNNING,
  TaskHealth.LOW_DATA,
  TaskHealth.NEVER_RAN,
  TaskHealth.HEALTHY,
  TaskHealth.DISABLED,
] as const;

/** Task table filter: one state, "needs attention" (stuck+failing+overdue+flaky) or all. */
export const {
  enum: TaskHealthFilter,
  options: TaskHealthFilterOptions,
  Value: TaskHealthFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.healthFilter.all",
  ATTENTION: "enums.healthFilter.attention",
  WITH_FAILURES: "enums.healthFilter.withFailures",
  STUCK: "enums.taskHealth.stuck",
  FAILING: "enums.taskHealth.failing",
  OVERDUE: "enums.taskHealth.overdue",
  FLAKY: "enums.taskHealth.flaky",
  RECOVERING: "enums.taskHealth.recovering",
  RUNNING: "enums.taskHealth.running",
  LOW_DATA: "enums.taskHealth.lowData",
  NEVER_RAN: "enums.taskHealth.neverRan",
  HEALTHY: "enums.taskHealth.healthy",
  DISABLED: "enums.taskHealth.disabled",
});

export const TaskHealthFilterDB = [
  TaskHealthFilter.ALL,
  TaskHealthFilter.ATTENTION,
  TaskHealthFilter.WITH_FAILURES,
  TaskHealthFilter.STUCK,
  TaskHealthFilter.FAILING,
  TaskHealthFilter.OVERDUE,
  TaskHealthFilter.FLAKY,
  TaskHealthFilter.RECOVERING,
  TaskHealthFilter.RUNNING,
  TaskHealthFilter.LOW_DATA,
  TaskHealthFilter.NEVER_RAN,
  TaskHealthFilter.HEALTHY,
  TaskHealthFilter.DISABLED,
] as const;

/** States that land in the "needs attention" list (never green). */
export const ATTENTION_HEALTH = [
  TaskHealth.STUCK,
  TaskHealth.FAILING,
  TaskHealth.OVERDUE,
  TaskHealth.FLAKY,
  TaskHealth.RECOVERING,
] as const;

/** This many clean finished runs in a row mark a flaky task as recovering. */
export const RECOVERY_RUNS = 3;
