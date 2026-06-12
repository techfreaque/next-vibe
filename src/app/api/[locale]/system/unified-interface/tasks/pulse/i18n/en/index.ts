export const translations = {
  execute: {
    category: "Pulse Execution",
    tags: {
      execute: "Execute",
    },
    post: {
      title: "Execute Pulse",
      description: "Execute pulse health monitoring and task execution",
      container: {
        title: "Pulse Execution",
        description: "Execute pulse monitoring and run scheduled tasks",
      },
      fields: {
        dryRun: {
          label: "Dry Run",
          description: "Perform a dry run without making actual changes",
        },
        taskNames: {
          label: "Task Names",
          description: "Specific task names to execute (optional)",
        },
        force: {
          label: "Force Execution",
          description: "Force execution even if tasks are not due",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
      },
      response: {
        pulseId: "Pulse ID",
        executedAt: "Executed At",
        totalTasksDiscovered: "Total Tasks Discovered",
        tasksDue: "Tasks Due",
        tasksExecuted: "Tasks Executed",
        tasksSucceeded: "Tasks Succeeded",
        tasksFailed: "Tasks Failed",
        tasksSkipped: "Tasks Skipped",
        totalExecutionTimeMs: "Total Execution Time (ms)",
        errors: "Errors",
        summary: "Execution Summary",
        results: "Results",
        resultsDescription: "Task execution results",
        taskName: "Task Name",
        success: "Success",
        duration: "Duration",
        message: "Message",
        executionFailed: "Execution failed",
        dryRunSuccess: "Dry run completed successfully",
        executionSuccess: "Execution completed successfully",
      },
      examples: {
        basic: {
          title: "Basic Pulse Execution",
        },
        dryRun: {
          title: "Dry Run Execution",
        },
        success: {
          title: "Successful Execution",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Internal Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  status: {
    category: "Pulse Status",
    tags: {
      status: "Status",
    },
    get: {
      title: "Pulse Status",
      description: "Get pulse health monitoring status",
      container: {
        title: "Pulse Health Status",
        description: "Monitor pulse execution health and statistics",
      },
      fields: {
        status: {
          title: "Status",
          label: "Pulse Status",
          description: "Current pulse health status",
        },
        lastPulseAt: {
          title: "Last Pulse At",
          label: "Last Pulse",
          description: "Timestamp of last pulse execution",
        },
        successRate: {
          title: "Success Rate",
          label: "Success Rate",
          description: "Percentage of successful pulse executions",
        },
        totalExecutions: {
          title: "Total Executions",
          label: "Total Executions",
          description: "Total number of pulse executions",
        },
      },
      examples: {
        basic: {
          title: "Basic Status Request",
        },
        success: {
          title: "Successful Status Response",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Internal Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  history: {
    category: "Task Management",

    tags: {
      pulse: "Pulse",
      monitoring: "Monitoring",
    },

    errors: {
      fetchCronTaskHistory: "Failed to fetch pulse execution history",
    },

    get: {
      title: "Pulse Execution History",
      description: "View historical pulse execution cycles",
      fields: {
        startDate: {
          label: "Start Date",
          description: "Filter pulse cycles after this date",
        },
        endDate: {
          label: "End Date",
          description: "Filter pulse cycles before this date",
        },
        status: {
          label: "Status",
          description: "Filter by execution status",
          placeholder: "All statuses",
        },
        limit: {
          label: "Results Limit",
          description: "Maximum number of results to return",
          placeholder: "50",
        },
        offset: {
          label: "Results Offset",
          description: "Number of results to skip for pagination",
          placeholder: "0",
        },
      },
      response: {
        executions: { title: "Pulse Executions" },
        totalCount: { title: "Total Count" },
        hasMore: { title: "Has More Results" },
        summary: { title: "Execution Summary" },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters provided",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while fetching pulse history",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You do not have permission to view pulse history",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access to pulse history is forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Pulse execution record not found",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "History Retrieved",
        description: "Pulse execution history retrieved successfully",
      },
    },
    pulse: {
      execution: {
        success: "Success",
        failure: "Failure",
        timeout: "Timeout",
        cancelled: "Cancelled",
        pending: "Pending",
      },
    },
    widget: {
      title: "Pulse History",
      empty: "No pulse executions found",
      details: "Details",
      discovered: "{{count}} discovered",
      due: "{{count}} due",
      succeeded: "{{count}} ok",
      failed: "{{count}} failed",
      tasksExecuted: "Executed",
      tasksSucceeded: "Succeeded",
      tasksFailed: "Failed",
      tasksSkipped: "Skipped",
      header: {
        cronHistory: "Cron History",
        stats: "Stats",
        refresh: "Refresh",
      },
      summary: {
        total: "Total",
        successful: "Successful",
        failed: "Failed",
        successRate: "Success Rate",
        avgDuration: "Avg Duration",
      },
      filter: {
        all: "All",
        success: "Success",
        failure: "Failed",
        timeout: "Timeout",
      },
      pagination: {
        info: "Page {{page}} of {{totalPages}} ({{total}} total)",
        prev: "Previous",
        next: "Next",
      },
    },
  },
  success: {
    title: "Success",
    description: "Pulse executed successfully",
    content: "Success",
  },
  container: {
    title: "Pulse Container",
    description: "Pulse container description",
  },
};
