/**
 * Task Watchdog Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** What a task incident is about. Stored on task_incidents.type. */
export const {
  enum: TaskIncidentType,
  options: TaskIncidentTypeOptions,
  Value: TaskIncidentTypeValue,
} = createEnumOptions(scopedTranslation, {
  TIMEOUT: "enums.incidentType.timeout",
  LOOP: "enums.incidentType.loop",
  BUDGET: "enums.incidentType.budget",
  TRANSIENT_RETRY_EXHAUSTED: "enums.incidentType.transientRetryExhausted",
  WATCHDOG_CANCEL: "enums.incidentType.watchdogCancel",
});

export const TaskIncidentTypeDB = [
  TaskIncidentType.TIMEOUT,
  TaskIncidentType.LOOP,
  TaskIncidentType.BUDGET,
  TaskIncidentType.TRANSIENT_RETRY_EXHAUSTED,
  TaskIncidentType.WATCHDOG_CANCEL,
] as const;

/** What a spend cap applies to. */
export const {
  enum: BudgetScope,
  options: BudgetScopeOptions,
  Value: BudgetScopeValue,
} = createEnumOptions(scopedTranslation, {
  TASK: "enums.budgetScope.task",
  DAY: "enums.budgetScope.day",
  GOAL: "enums.budgetScope.goal",
});

export const BudgetScopeDB = [
  BudgetScope.TASK,
  BudgetScope.DAY,
  BudgetScope.GOAL,
] as const;

/** What a ledger row paid for. */
export const {
  enum: SpendKind,
  options: SpendKindOptions,
  Value: SpendKindValue,
} = createEnumOptions(scopedTranslation, {
  MODEL: "enums.spendKind.model",
  TOOL: "enums.spendKind.tool",
});

export const SpendKindDB = [SpendKind.MODEL, SpendKind.TOOL] as const;

/** Series a Task Health data source node can chart. */
export const {
  enum: TaskHealthMetric,
  options: TaskHealthMetricOptions,
  Value: TaskHealthMetricValue,
} = createEnumOptions(scopedTranslation, {
  STARTED: "enums.healthMetric.started",
  COMPLETED: "enums.healthMetric.completed",
  FAILED: "enums.healthMetric.failed",
  WATCHDOG_CANCELLED: "enums.healthMetric.watchdogCancelled",
  AVG_DURATION: "enums.healthMetric.avgDuration",
  P95_DURATION: "enums.healthMetric.p95Duration",
  CREDIT_SPEND: "enums.healthMetric.creditSpend",
  INCIDENTS: "enums.healthMetric.incidents",
});

/** Incident type filter for the incidents metric: one type or all. */
export const {
  enum: TaskIncidentTypeFilter,
  options: TaskIncidentTypeFilterOptions,
  Value: TaskIncidentTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.incidentType.all",
  TIMEOUT: "enums.incidentType.timeout",
  LOOP: "enums.incidentType.loop",
  BUDGET: "enums.incidentType.budget",
  TRANSIENT_RETRY_EXHAUSTED: "enums.incidentType.transientRetryExhausted",
  WATCHDOG_CANCEL: "enums.incidentType.watchdogCancel",
});
