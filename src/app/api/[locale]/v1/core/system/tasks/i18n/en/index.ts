import { translations as cronTranslations } from "../../cron/i18n/en";
import { translations as pulseTranslations } from "../../pulse/i18n/en";
import { translations as sideTasksTranslations } from "../../side-tasks/i18n/en";
import { translations as typesTranslations } from "../../types/i18n/en";
import { translations as unifiedRunnerTranslations } from "../../unified-runner/i18n/en";

export const translations = {
  category: "Task Management",
  type: {
    cron: "Cron Task",
    side: "Side Task",
    task_runner: "Task Runner",
  },
  priority: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    background: "Background",
    filter: {
      all: "All Priorities",
      highAndAbove: "High and Above",
      mediumAndAbove: "Medium and Above",
    },
  },
  status: {
    pending: "Pending",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
    timeout: "Timeout",
    cancelled: "Cancelled",
    skipped: "Skipped",
    blocked: "Blocked",
    scheduled: "Scheduled",
    stopped: "Stopped",
    error: "Error",
    filter: {
      all: "All Statuses",
      active: "Active",
      error: "Error States",
    },
  },
  taskCategory: {
    development: "Development",
    build: "Build",
    watch: "Watch",
    generator: "Generator",
    test: "Test",
    maintenance: "Maintenance",
    database: "Database",
    system: "System",
    monitoring: "Monitoring",
  },
  sort: {
    asc: "Ascending",
    desc: "Descending",
  },
  pulse: {
    health: {
      healthy: "Healthy",
      warning: "Warning",
      critical: "Critical",
      unknown: "Unknown",
    },
    execution: {
      success: "Success",
      failure: "Failure",
      timeout: "Timeout",
      cancelled: "Cancelled",
      pending: "Pending",
    },
  },
  errors: {
    // Side Tasks errors
    fetchSideTaskByName: "Failed to fetch side task by name",
    updateSideTask: "Failed to update side task",
    deleteSideTask: "Failed to delete side task",
    createSideTaskExecution: "Failed to create side task execution",
    updateSideTaskExecution: "Failed to update side task execution",
    fetchSideTaskExecutions: "Failed to fetch side task executions",
    fetchRecentSideTaskExecutions:
      "Failed to fetch recent side task executions",
    createSideTaskHealthCheck: "Failed to create side task health check",
    fetchLatestHealthCheck: "Failed to fetch latest health check",
    fetchHealthCheckHistory: "Failed to fetch health check history",
    fetchSideTaskStatistics: "Failed to fetch side task statistics",
    sideTaskNotFound: "Side task not found",
    sideTaskExecutionNotFound: "Side task execution not found",

    // Cron Tasks errors
    fetchCronTasks: "Failed to fetch cron tasks",
    createCronTask: "Failed to create cron task",
    updateCronTask: "Failed to update cron task",
    deleteCronTask: "Failed to delete cron task",
    fetchCronTaskHistory: "Failed to fetch cron task history",
    fetchCronTaskStats: "Failed to fetch cron task statistics",
    fetchCronStatus: "Failed to fetch cron system status",
    cronTaskNotFound: "Cron task not found",

    // Types errors
    fetchTaskTypes: "Failed to fetch task types",
    validateTaskTypes: "Failed to validate task types",
    exportTaskTypes: "Failed to export task types",
    unsupportedExportFormat: "Unsupported export format",

    // Unified Runner errors
    startTaskRunner: "Failed to start task runner",
    stopTaskRunner: "Failed to stop task runner",
    getTaskRunnerStatus: "Failed to get task runner status",
    executeCronTask: "Failed to execute cron task",
    executeSideTask: "Failed to execute side task",

    // Pulse errors
    executePulse: "Failed to execute pulse",
    fetchPulseStatus: "Failed to fetch pulse status",
    pulseExecutionFailed: "Pulse execution failed",
  },
  cron: cronTranslations,
  pulseSystem: pulseTranslations,
  sideTasks: sideTasksTranslations,
  types: typesTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
