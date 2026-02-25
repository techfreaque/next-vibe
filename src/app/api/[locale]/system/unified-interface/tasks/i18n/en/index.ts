import { translations as cronTranslations } from "../../cron/i18n/en";
import { translations as pulseTranslations } from "../../pulse/i18n/en";
import { translations as unifiedRunnerTranslations } from "../../unified-runner/i18n/en";

export const translations = {
  category: "Task Management",
  tags: {
    tasks: "Tasks",
  },
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
    leadManagement: "Lead Management",
  },
  enabledFilter: {
    all: "All",
    enabled: "Enabled",
    disabled: "Disabled",
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
  cron: {
    frequency: {
      everyMinute: "every minute",
      everyMinutes: "every {interval} minutes",
      everyHour: "every hour",
      everyDays: "every day",
      hourly: "hourly",
    },
    days: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },
    common: {
      dailyAtMidnight: "daily at midnight",
      dailyAtNoon: "daily at noon",
      weeklyOnSunday: "weekly on Sunday",
      monthlyOnFirst: "monthly on the 1st",
      everyFiveMinutes: "every 5 minutes",
      everyThreeMinutes: "every 3 minutes",
      everyOneMinutes: "every minute",
      everyTenMinutes: "every 10 minutes",
      everyFifteenMinutes: "every 15 minutes",
      everyThirtyMinutes: "every 30 minutes",
    },
    patterns: {
      everyIntervalMinutes: "every {interval} minutes",
      everyIntervalMinutesStarting:
        "every {interval} minutes starting at minute {start}",
      atMinutes: "at minutes {minutes}",
      fromMinuteToMinute: "from minute {from} to {to}",
      atMinute: "at minute {minute}",
      everyIntervalHours: "every {interval} hours",
      everyIntervalHoursStarting:
        "every {interval} hours starting at hour {start}",
      atHours: "at hours {hours}",
      fromHourToHour: "from hour {from} to {to}",
      atHour: "at hour {hour}",
    },
    calendar: {
      onDays: "on days {days}",
      onDay: "on day {day}",
      inMonths: "in {months}",
      inMonth: "in {month}",
      onWeekdays: "on {weekdays}",
      fromWeekdayToWeekday: "from {from} to {to}",
      onWeekday: "on {weekday}",
    },
    timezone: "in {timezone}",
    time: {
      midnight: "midnight",
      noon: "noon",
      hourAm: "{hour} AM",
      hourPm: "{hour} PM",
      hourMinuteAm: "{hour}:{minute} AM",
      hourMinutePm: "{hour}:{minute} PM",
    },
    weekdays: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Failed to fetch cron tasks",
    createCronTask: "Failed to create cron task",
    updateCronTask: "Failed to update cron task",
    deleteCronTask: "Failed to delete cron task",
    fetchCronTaskHistory: "Failed to fetch cron task history",
    fetchCronTaskStats: "Failed to fetch cron task statistics",
    fetchCronStatus: "Failed to fetch cron system status",
    cronTaskNotFound: "Cron task not found",

    // Unified Runner errors
    startTaskRunner: "Failed to start task runner",
    stopTaskRunner: "Failed to stop task runner",
    getTaskRunnerStatus: "Failed to get task runner status",
    executeCronTask: "Failed to execute cron task",

    // Pulse errors
    executePulse: "Failed to execute pulse",
    fetchPulseStatus: "Failed to fetch pulse status",
    pulseExecutionFailed: "Pulse execution failed",
    pulseInternalError: "Internal error in pulse system",

    // Validation errors
    invalidTaskInput: "Task input does not match the endpoint's request schema",
    endpointNotFound: "Endpoint not found for the given route ID",

    // Repository errors
    repositoryNotFound: "Resource not found",
    repositoryInternalError: "An internal error occurred",
    repositoryGetTaskForbidden: "You do not have permission to view this task",
    repositoryUpdateTaskForbidden:
      "You do not have permission to update this task",
    repositoryDeleteTaskForbidden:
      "You do not have permission to delete this task",

    // Task sync errors
    taskSyncListFailed: "Failed to list tasks for sync",
    taskSyncSyncFailed: "Failed to sync tasks from remote",
  },
  common: {
    cronRepositoryTaskUpdateFailed: "Failed to update cron task",
    cronRepositoryTaskDeleteFailed: "Failed to delete cron task",
    cronRepositoryExecutionCreateFailed: "Failed to create cron task execution",
    cronRepositoryExecutionUpdateFailed: "Failed to update cron task execution",
    cronRepositoryExecutionsFetchFailed: "Failed to fetch cron task executions",
    cronRepositoryRecentExecutionsFetchFailed:
      "Failed to fetch recent cron task executions",
    cronRepositorySchedulesFetchFailed: "Failed to fetch cron task schedules",
    cronRepositoryScheduleUpdateFailed: "Failed to update cron task schedule",
    cronRepositoryStatisticsFetchFailed: "Failed to fetch cron task statistics",
  },
  outputMode: {
    storeOnly: "Store Only",
    notifyOnFailure: "Notify on Failure",
    notifyAlways: "Notify Always",
  },
  dbHealthCheck: {
    name: "db-health-check",
    description: "Verifies database connection health every minute",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Calls the pulse repository once per minute to trigger scheduled tasks",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Watches for file changes and triggers generators in development mode",
  },
  dbHealth: {
    tag: "Database",
    post: {
      title: "DB Health Check",
      description: "Check database connectivity",
      container: {
        title: "Database Health",
        description: "Verify database connection is healthy",
      },
      response: {
        healthy: "Healthy",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        server: {
          title: "Server Error",
          description: "Database health check failed",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
      },
      success: {
        title: "DB Healthy",
        description: "Database connection is healthy",
      },
    },
  },
  taskSync: {
    name: "task-sync",
    description: "Periodically pulls new tasks from remote Thea instance",
    post: {
      title: "Sync Tasks",
      description: "Sync tasks from remote Thea instance",
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Internal Error",
          description: "Task sync failed",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Unsaved changes detected",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
      success: {
        title: "Tasks Synced",
        description: "Tasks synced successfully",
      },
    },
    pull: {
      post: {
        title: "Pull Tasks",
        description: "Pull tasks from remote Thea instance",
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          internal: {
            title: "Internal Error",
            description: "Task pull failed",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
        },
        success: {
          title: "Tasks Pulled",
          description: "Tasks pulled successfully",
        },
      },
    },
  },
  completeTask: {
    post: {
      title: "Complete Task",
      description:
        "Mark a cron task as completed or failed and push the result to the originating remote instance. Dev-only MCP tool designed for interactive Claude Code sessions. When Thea creates a task for Hermes, Claude Code calls this tool after the user confirms the work is done.",
      fields: {
        taskId: {
          title: "Task ID",
          description: "The cron task database ID to mark as complete.",
        },
        status: {
          title: "Status",
          description:
            "Final status: 'completed' for success, 'failed' for failure.",
        },
        summary: {
          title: "Summary",
          description:
            "Brief description of what was accomplished or why it failed.",
        },
        completed: {
          title: "Completed",
          description: "Whether the task was successfully marked as done.",
        },
        pushedToRemote: {
          title: "Pushed to Remote",
          description:
            "Whether the completion was successfully reported to the originating instance.",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid task ID or status value",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Completion Failed",
          description: "Failed to mark task as complete",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Task Not Found",
          description: "No task found with the given ID",
        },
        network: {
          title: "Network Error",
          description: "Failed to push completion to remote instance",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Unsaved changes detected",
        },
        conflict: {
          title: "Conflict",
          description: "Task is not in a completable state",
        },
      },
      success: {
        title: "Task Completed",
        description:
          "Task marked as done and result pushed to originating instance",
      },
    },
  },
  taskReport: {
    post: {
      title: "Report Task Result",
      description:
        "Accept execution results from a remote instance. Called by dev instances to report task completion back to the originating prod instance.",
      fields: {
        apiKey: {
          title: "API Key",
          description: "Shared secret for instance authentication.",
        },
        taskRouteId: {
          title: "Task Route ID",
          description: "The routeId of the completed task.",
        },
        executionId: {
          title: "Execution ID",
          description: "Unique execution identifier for deduplication.",
        },
        status: {
          title: "Status",
          description: "Final execution status.",
        },
        durationMs: {
          title: "Duration (ms)",
          description: "Total execution time in milliseconds.",
        },
        summary: {
          title: "Summary",
          description: "Human-readable summary of the execution result.",
        },
        error: {
          title: "Error",
          description: "Error message if the task failed.",
        },
        serverTimezone: {
          title: "Server Timezone",
          description:
            "IANA timezone of the executing server (e.g. Europe/Vienna).",
        },
        executedByInstance: {
          title: "Executed By",
          description: "Instance ID that ran the task (e.g. hermes).",
        },
        processed: {
          title: "Processed",
          description: "Whether the report was accepted and applied.",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid report payload",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Invalid API key",
        },
        internal: {
          title: "Internal Error",
          description: "Failed to process the report",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Task not found on this instance",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Unsaved changes detected",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
      success: {
        title: "Report Accepted",
        description: "Execution result applied to the task record",
      },
    },
  },
  csvProcessor: {
    description: "Processes CSV import jobs in chunks",
  },
  imapSync: {
    description:
      "Synchronizes IMAP accounts, folders, and messages automatically",
  },
  newsletterUnsubscribeSync: {
    description: "Synchronizes lead statuses for newsletter unsubscribes",
  },
  cronSystem: cronTranslations,
  pulseSystem: pulseTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
