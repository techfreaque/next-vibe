/**
 * Unified Task System Enums
 * Using createEnumOptions pattern as per MIGRATION_GUIDE.md
 * Merged from tasks and side-tasks-old systems
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Task Types
 * Unified task type definitions
 */
export const {
  enum: TaskType,
  options: TaskTypeOptions,
  Value: TaskTypeValue,
} = createEnumOptions(scopedTranslation, {
  CRON: "type.cron" as const,
  TASK_RUNNER: "type.task_runner" as const,
});
export const TaskTypeDB = [TaskType.CRON, TaskType.TASK_RUNNER] as const;

/**
 * Task Priority Levels
 * Unified from both systems with proper translation keys
 */
export const {
  enum: CronTaskPriority,
  options: CronTaskPriorityOptions,
  Value: CronTaskPriorityValue,
} = createEnumOptions(scopedTranslation, {
  CRITICAL: "priority.critical" as const,
  HIGH: "priority.high" as const,
  MEDIUM: "priority.medium" as const,
  LOW: "priority.low" as const,
  BACKGROUND: "priority.background" as const,
} as const);
export const CronTaskPriorityDB = [
  CronTaskPriority.CRITICAL,
  CronTaskPriority.HIGH,
  CronTaskPriority.MEDIUM,
  CronTaskPriority.LOW,
  CronTaskPriority.BACKGROUND,
] as const;

/**
 * Task Priority Filter Options (includes "all" for filtering)
 */
export const {
  enum: CronTaskPriorityFilter,
  options: CronTaskPriorityFilterOptions,
  Value: CronTaskPriorityFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "priority.filter.all" as const,
  CRITICAL: "priority.critical" as const,
  HIGH: "priority.high" as const,
  MEDIUM: "priority.medium" as const,
  LOW: "priority.low" as const,
  BACKGROUND: "priority.background" as const,
  HIGH_AND_ABOVE: "priority.filter.highAndAbove" as const,
  MEDIUM_AND_ABOVE: "priority.filter.mediumAndAbove" as const,
});

/**
 * Task Execution Status
 * Unified from both systems
 */
export const {
  enum: CronTaskStatus,
  options: CronTaskStatusOptions,
  Value: CronTaskStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "status.pending" as const,
  RUNNING: "status.running" as const,
  COMPLETED: "status.completed" as const,
  FAILED: "status.failed" as const,
  TIMEOUT: "status.timeout" as const,
  CANCELLED: "status.cancelled" as const,
  SKIPPED: "status.skipped" as const,
  BLOCKED: "status.blocked" as const,
  SCHEDULED: "status.scheduled" as const,
  STOPPED: "status.stopped" as const,
  ERROR: "status.error" as const,
});
export const CronTaskStatusDB = [
  CronTaskStatus.PENDING,
  CronTaskStatus.RUNNING,
  CronTaskStatus.COMPLETED,
  CronTaskStatus.FAILED,
  CronTaskStatus.TIMEOUT,
  CronTaskStatus.CANCELLED,
  CronTaskStatus.SKIPPED,
  CronTaskStatus.BLOCKED,
  CronTaskStatus.SCHEDULED,
  CronTaskStatus.STOPPED,
  CronTaskStatus.ERROR,
] as const;

/**
 * Task Status Filter Options
 */
export const {
  enum: CronTaskStatusFilter,
  options: CronTaskStatusFilterOptions,
  Value: CronTaskStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "status.filter.all" as const,
  ACTIVE: "status.filter.active" as const,
  COMPLETED: "status.completed" as const,
  FAILED: "status.failed" as const,
  RUNNING: "status.running" as const,
  PENDING: "status.pending" as const,
  ERROR: "status.filter.error" as const,
  STOPPED: "status.stopped" as const,
});

/**
 * Task Categories
 * Unified categories from both systems
 */
export const {
  enum: TaskCategory,
  options: TaskCategoryOptions,
  Value: TaskCategoryValue,
} = createEnumOptions(scopedTranslation, {
  DEVELOPMENT: "taskCategory.development" as const,
  BUILD: "taskCategory.build" as const,
  WATCH: "taskCategory.watch" as const,
  GENERATOR: "taskCategory.generator" as const,
  TEST: "taskCategory.test" as const,
  MAINTENANCE: "taskCategory.maintenance" as const,
  DATABASE: "taskCategory.database" as const,
  SYSTEM: "taskCategory.system" as const,
  MONITORING: "taskCategory.monitoring" as const,
});
export const TaskCategoryDB = [
  TaskCategory.DEVELOPMENT,
  TaskCategory.BUILD,
  TaskCategory.WATCH,
  TaskCategory.GENERATOR,
  TaskCategory.TEST,
  TaskCategory.MAINTENANCE,
  TaskCategory.DATABASE,
  TaskCategory.SYSTEM,
  TaskCategory.MONITORING,
] as const;

/**
 * Task Enabled Filter
 * Tri-state filter: all tasks / enabled only / disabled only
 */
export const {
  enum: CronTaskEnabledFilter,
  options: CronTaskEnabledFilterOptions,
  Value: CronTaskEnabledFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enabledFilter.all" as const,
  ENABLED: "enabledFilter.enabled" as const,
  DISABLED: "enabledFilter.disabled" as const,
});
export const CronTaskEnabledFilterDB = [
  CronTaskEnabledFilter.ALL,
  CronTaskEnabledFilter.ENABLED,
  CronTaskEnabledFilter.DISABLED,
] as const;

/**
 * Sort Order
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "sort.asc" as const,
  DESC: "sort.desc" as const,
});

/**
 * Pulse Health Status
 * For system health monitoring
 */
export const {
  enum: PulseHealthStatus,
  options: PulseHealthStatusOptions,
  Value: PulseHealthStatusValue,
} = createEnumOptions(scopedTranslation, {
  HEALTHY: "pulse.health.healthy" as const,
  WARNING: "pulse.health.warning" as const,
  CRITICAL: "pulse.health.critical" as const,
  UNKNOWN: "pulse.health.unknown" as const,
});
export const PulseHealthStatusDB = [
  PulseHealthStatus.HEALTHY,
  PulseHealthStatus.WARNING,
  PulseHealthStatus.CRITICAL,
  PulseHealthStatus.UNKNOWN,
] as const;

/**
 * Task Output Mode
 * Controls what happens after a cron task execution completes
 */
export const {
  enum: TaskOutputMode,
  options: TaskOutputModeOptions,
  Value: TaskOutputModeValue,
} = createEnumOptions(scopedTranslation, {
  STORE_ONLY: "outputMode.storeOnly" as const,
  NOTIFY_ON_FAILURE: "outputMode.notifyOnFailure" as const,
  NOTIFY_ALWAYS: "outputMode.notifyAlways" as const,
});
export const TaskOutputModeDB = [
  TaskOutputMode.STORE_ONLY,
  TaskOutputMode.NOTIFY_ON_FAILURE,
  TaskOutputMode.NOTIFY_ALWAYS,
] as const;

/**
 * Pulse Execution Status
 * For pulse execution tracking
 */
export const {
  enum: PulseExecutionStatus,
  options: PulseExecutionStatusOptions,
  Value: PulseExecutionStatusValue,
} = createEnumOptions(scopedTranslation, {
  SUCCESS: "pulse.execution.success" as const,
  FAILURE: "pulse.execution.failure" as const,
  TIMEOUT: "pulse.execution.timeout" as const,
  CANCELLED: "pulse.execution.cancelled" as const,
  PENDING: "pulse.execution.pending" as const,
});
export const PulseExecutionStatusDB = [
  PulseExecutionStatus.SUCCESS,
  PulseExecutionStatus.FAILURE,
  PulseExecutionStatus.TIMEOUT,
  PulseExecutionStatus.CANCELLED,
  PulseExecutionStatus.PENDING,
] as const;

/**
 * Helper Functions for Filter Mapping
 */

/**
 * Map priority filter to actual priorities
 */
export function mapPriorityFilter(
  filter: typeof CronTaskPriorityFilterValue,
): Array<typeof CronTaskPriorityValue> {
  switch (filter) {
    case CronTaskPriorityFilter.ALL:
      return Object.values(CronTaskPriority);
    case CronTaskPriorityFilter.CRITICAL:
      return [CronTaskPriority.CRITICAL];
    case CronTaskPriorityFilter.HIGH:
      return [CronTaskPriority.HIGH];
    case CronTaskPriorityFilter.MEDIUM:
      return [CronTaskPriority.MEDIUM];
    case CronTaskPriorityFilter.LOW:
      return [CronTaskPriority.LOW];
    case CronTaskPriorityFilter.BACKGROUND:
      return [CronTaskPriority.BACKGROUND];
    case CronTaskPriorityFilter.HIGH_AND_ABOVE:
      return [CronTaskPriority.CRITICAL, CronTaskPriority.HIGH];
    case CronTaskPriorityFilter.MEDIUM_AND_ABOVE:
      return [
        CronTaskPriority.CRITICAL,
        CronTaskPriority.HIGH,
        CronTaskPriority.MEDIUM,
      ];
    default:
      return Object.values(CronTaskPriority);
  }
}

/**
 * Map status filter to actual statuses
 */
export function mapStatusFilter(
  filter: typeof CronTaskStatusFilterValue,
): Array<typeof CronTaskStatusValue> {
  switch (filter) {
    case CronTaskStatusFilter.ALL:
      return Object.values(CronTaskStatus);
    case CronTaskStatusFilter.ACTIVE:
      return [
        CronTaskStatus.PENDING,
        CronTaskStatus.RUNNING,
        CronTaskStatus.SCHEDULED,
      ];
    case CronTaskStatusFilter.COMPLETED:
      return [CronTaskStatus.COMPLETED];
    case CronTaskStatusFilter.FAILED:
      return [CronTaskStatus.FAILED];
    case CronTaskStatusFilter.RUNNING:
      return [CronTaskStatus.RUNNING];
    case CronTaskStatusFilter.PENDING:
      return [CronTaskStatus.PENDING];
    case CronTaskStatusFilter.ERROR:
      return [
        CronTaskStatus.FAILED,
        CronTaskStatus.TIMEOUT,
        CronTaskStatus.ERROR,
      ];
    case CronTaskStatusFilter.STOPPED:
      return [CronTaskStatus.STOPPED];
    default:
      return Object.values(CronTaskStatus);
  }
}

/**
 * Get priority weight for sorting (higher number = higher priority)
 */
export function getPriorityWeight(
  priority: typeof CronTaskPriorityValue,
): number {
  switch (priority) {
    case CronTaskPriority.CRITICAL:
      return 5;
    case CronTaskPriority.HIGH:
      return 4;
    case CronTaskPriority.MEDIUM:
      return 3;
    case CronTaskPriority.LOW:
      return 2;
    case CronTaskPriority.BACKGROUND:
      return 1;
    default:
      return 3; // Default to medium
  }
}

/**
 * Check if status indicates task is active/running
 */
export function isActiveStatus(status: typeof CronTaskStatusValue): boolean {
  const activeStatuses = [
    CronTaskStatus.PENDING,
    CronTaskStatus.RUNNING,
    CronTaskStatus.SCHEDULED,
  ] as const;
  return (activeStatuses as readonly string[]).includes(status);
}

/**
 * Check if status indicates task failed
 */
export function isFailureStatus(status: typeof CronTaskStatusValue): boolean {
  const failureStatuses = [
    CronTaskStatus.FAILED,
    CronTaskStatus.TIMEOUT,
    CronTaskStatus.ERROR,
    CronTaskStatus.CANCELLED,
  ] as const;
  return (failureStatuses as readonly string[]).includes(status);
}

/**
 * Check if status indicates task completed successfully
 */
export function isSuccessStatus(status: typeof CronTaskStatusValue): boolean {
  return status === CronTaskStatus.COMPLETED;
}
