import { translations as cronTranslations } from "../../cron/i18n/en";
import { translations as pulseTranslations } from "../../pulse/i18n/en";
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
  claudeCode: {
    tags: {
      tasks: "Tasks",
    },
    run: {
      post: {
        title: "Run Claude Code",
        description:
          "Launch a Claude Code session on Hermes (the local dev machine). PREFER headless:false (default) — this opens a full back-and-forth Claude Code session where Max can actively participate. Use headless:true only for fully automated batch tasks that need no human input and must return output programmatically (e.g. cron jobs, automated review). In interactive mode the session streams live to the terminal and waits for the user; in batch mode it runs `claude -p`, collects all output, and returns when done. Always runs with --dangerously-skip-permissions so no confirmation prompts interrupt the flow.",
        fields: {
          prompt: {
            title: "Prompt",
            description:
              "The task or question to send to Claude Code. Be specific — include file paths, context, and expected output format.",
          },
          model: {
            title: "Model",
            description:
              "Claude model ID to use (e.g. claude-sonnet-4-6, claude-opus-4-6). Defaults to the Claude Code default if omitted.",
          },
          maxBudgetUsd: {
            title: "Max Budget (USD)",
            description:
              "Maximum spend limit in USD for this run. Prevents runaway tool-use costs. Omit for no limit.",
          },
          systemPrompt: {
            title: "System Prompt",
            description:
              "Optional system prompt to prepend. Use to set persona, constraints, or context that applies to the entire session.",
          },
          allowedTools: {
            title: "Allowed Tools",
            description:
              "Comma-separated list of tools Claude Code may use (e.g. Read,Edit,Bash). Omit to allow all default tools.",
          },
          headless: {
            title: "Headless (batch mode)",
            description:
              "PREFER false (default). Headless:false opens a full interactive Claude Code session — Max can see output live and participate. Set to true only for fully automated batch tasks (cron jobs, pipelines) where no human interaction is needed and output must be returned as a value.",
          },
          workingDir: {
            title: "Working Directory",
            description:
              "Absolute path to set as the working directory for the Claude Code process. Defaults to the server's current working directory.",
          },
          timeoutMs: {
            title: "Timeout (ms)",
            description:
              "Maximum execution time in milliseconds. Defaults to 600000 (10 minutes). Increase for long-running tasks.",
          },
          output: {
            title: "Output",
            description: "Combined stdout from the Claude Code process.",
          },
          exitCode: {
            title: "Exit Code",
            description:
              "Process exit code. 0 = success, non-zero = error or partial failure.",
          },
          durationMs: {
            title: "Duration (ms)",
            description: "Total wall-clock time the process ran.",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters — check prompt and fields",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required — admin role needed",
          },
          internal: {
            title: "Execution Failed",
            description:
              "Claude Code process failed to start or crashed unexpectedly",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied — insufficient permissions",
          },
          notFound: {
            title: "Not Found",
            description: "Resource or working directory not found",
          },
          network: {
            title: "Network Error",
            description: "Network error communicating with Claude Code",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred during execution",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes conflict detected",
          },
          conflict: {
            title: "Conflict",
            description: "Execution conflict — another session may be running",
          },
        },
        success: {
          title: "Claude Code Completed",
          description:
            "Claude Code process finished — check exitCode for success/failure and output for results",
        },
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
