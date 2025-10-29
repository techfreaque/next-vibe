/**
 * Unified Task System Enums
 * Using createEnumOptions pattern as per MIGRATION_GUIDE.md
 * Merged from tasks and side-tasks-old systems
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * Task Types
 * Unified task type definitions
 */
export const {
  enum: TaskType,
  options: TaskTypeOptions,
  Value: TaskTypeValue,
} = createEnumOptions({
  CRON: "app.api.v1.core.system.unifiedBackend.tasks.type.cron" as const,
  SIDE: "app.api.v1.core.system.unifiedBackend.tasks.type.side" as const,
  TASK_RUNNER:
    "app.api.v1.core.system.unifiedBackend.tasks.type.task_runner" as const,
});
export const TaskTypeDB = [
  TaskType.CRON,
  TaskType.SIDE,
  TaskType.TASK_RUNNER,
] as const;

/**
 * Task Priority Levels
 * Unified from both systems with proper translation keys
 */
export const {
  enum: CronTaskPriority,
  options: CronTaskPriorityOptions,
  Value: CronTaskPriorityValue,
} = createEnumOptions({
  CRITICAL:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.critical" as const,
  HIGH: "app.api.v1.core.system.unifiedBackend.tasks.priority.high" as const,
  MEDIUM:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.medium" as const,
  LOW: "app.api.v1.core.system.unifiedBackend.tasks.priority.low" as const,
  BACKGROUND:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.background" as const,
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
} = createEnumOptions({
  ALL: "app.api.v1.core.system.unifiedBackend.tasks.priority.filter.all" as const,
  CRITICAL:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.critical" as const,
  HIGH: "app.api.v1.core.system.unifiedBackend.tasks.priority.high" as const,
  MEDIUM:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.medium" as const,
  LOW: "app.api.v1.core.system.unifiedBackend.tasks.priority.low" as const,
  BACKGROUND:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.background" as const,
  HIGH_AND_ABOVE:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.filter.highAndAbove" as const,
  MEDIUM_AND_ABOVE:
    "app.api.v1.core.system.unifiedBackend.tasks.priority.filter.mediumAndAbove" as const,
});

/**
 * Task Execution Status
 * Unified from both systems
 */
export const {
  enum: CronTaskStatus,
  options: CronTaskStatusOptions,
  Value: CronTaskStatusValue,
} = createEnumOptions({
  PENDING:
    "app.api.v1.core.system.unifiedBackend.tasks.status.pending" as const,
  RUNNING:
    "app.api.v1.core.system.unifiedBackend.tasks.status.running" as const,
  COMPLETED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.completed" as const,
  FAILED: "app.api.v1.core.system.unifiedBackend.tasks.status.failed" as const,
  TIMEOUT:
    "app.api.v1.core.system.unifiedBackend.tasks.status.timeout" as const,
  CANCELLED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.cancelled" as const,
  SKIPPED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.skipped" as const,
  BLOCKED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.blocked" as const,
  SCHEDULED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.scheduled" as const,
  STOPPED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.stopped" as const,
  ERROR: "app.api.v1.core.system.unifiedBackend.tasks.status.error" as const,
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
} = createEnumOptions({
  ALL: "app.api.v1.core.system.unifiedBackend.tasks.status.filter.all" as const,
  ACTIVE:
    "app.api.v1.core.system.unifiedBackend.tasks.status.filter.active" as const,
  COMPLETED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.completed" as const,
  FAILED: "app.api.v1.core.system.unifiedBackend.tasks.status.failed" as const,
  RUNNING:
    "app.api.v1.core.system.unifiedBackend.tasks.status.running" as const,
  PENDING:
    "app.api.v1.core.system.unifiedBackend.tasks.status.pending" as const,
  ERROR:
    "app.api.v1.core.system.unifiedBackend.tasks.status.filter.error" as const,
  STOPPED:
    "app.api.v1.core.system.unifiedBackend.tasks.status.stopped" as const,
});

/**
 * Task Categories
 * Unified categories from both systems
 */
export const {
  enum: TaskCategory,
  options: TaskCategoryOptions,
  Value: TaskCategoryValue,
} = createEnumOptions({
  DEVELOPMENT:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.development" as const,
  BUILD:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.build" as const,
  WATCH:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.watch" as const,
  GENERATOR:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.generator" as const,
  TEST: "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.test" as const,
  MAINTENANCE:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.maintenance" as const,
  DATABASE:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.database" as const,
  SYSTEM:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.system" as const,
  MONITORING:
    "app.api.v1.core.system.unifiedBackend.tasks.taskCategory.monitoring" as const,
});

/**
 * Sort Order
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions({
  ASC: "app.api.v1.core.system.unifiedBackend.tasks.sort.asc" as const,
  DESC: "app.api.v1.core.system.unifiedBackend.tasks.sort.desc" as const,
});

/**
 * Pulse Health Status
 * For system health monitoring
 */
export const {
  enum: PulseHealthStatus,
  options: PulseHealthStatusOptions,
  Value: PulseHealthStatusValue,
} = createEnumOptions({
  HEALTHY:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.health.healthy" as const,
  WARNING:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.health.warning" as const,
  CRITICAL:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.health.critical" as const,
  UNKNOWN:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.health.unknown" as const,
});
export const PulseHealthStatusDB = [
  PulseHealthStatus.HEALTHY,
  PulseHealthStatus.WARNING,
  PulseHealthStatus.CRITICAL,
  PulseHealthStatus.UNKNOWN,
] as const;

/**
 * Pulse Execution Status
 * For pulse execution tracking
 */
export const {
  enum: PulseExecutionStatus,
  options: PulseExecutionStatusOptions,
  Value: PulseExecutionStatusValue,
} = createEnumOptions({
  SUCCESS:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.execution.success" as const,
  FAILURE:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.execution.failure" as const,
  TIMEOUT:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.execution.timeout" as const,
  CANCELLED:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.execution.cancelled" as const,
  PENDING:
    "app.api.v1.core.system.unifiedBackend.tasks.pulse.execution.pending" as const,
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

/**
 * Backward compatibility aliases
 */
export const TaskPriorityDB = CronTaskPriorityDB;
export const TaskStatusDB = CronTaskStatusDB;
