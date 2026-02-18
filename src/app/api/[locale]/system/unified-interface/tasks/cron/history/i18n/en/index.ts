export const translations = {
  get: {
    tags: {
      tasks: "Tasks",
      monitoring: "Monitoring",
    },
    title: "Task Execution History",
    description: "View historical execution records for cron tasks",
    fields: {
      taskId: {
        label: "Task ID",
        description: "Filter by specific task ID",
        placeholder: "Enter task ID",
      },
      taskName: {
        label: "Task Name",
        description: "Filter by task name (partial match)",
        placeholder: "Enter task name",
      },
      status: {
        label: "Execution Status",
        description: "Filter by execution status",
        placeholder: "Select statuses",
        options: {
          PENDING: "Pending",
          SCHEDULED: "Scheduled",
          RUNNING: "Running",
          COMPLETED: "Completed",
          FAILED: "Failed",
          ERROR: "Error",
          TIMEOUT: "Timeout",
          SKIPPED: "Skipped",
          CANCELLED: "Cancelled",
          STOPPED: "Stopped",
          BLOCKED: "Blocked",
        },
      },
      priority: {
        label: "Task Priority",
        description: "Filter by task priority level",
        placeholder: "Select priorities",
        options: {
          LOW: "Low",
          MEDIUM: "Medium",
          HIGH: "High",
          CRITICAL: "Critical",
        },
      },
      startDate: {
        label: "Start Date",
        description: "Filter executions after this date",
      },
      endDate: {
        label: "End Date",
        description: "Filter executions before this date",
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
      title: "Task History Response",
      description: "Historical execution data for cron tasks",
      executions: {
        title: "Execution Records",
      },
      totalCount: {
        title: "Total Count",
      },
      hasMore: {
        title: "Has More Results",
      },
      summary: {
        title: "Execution Summary",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters provided",
      },
      internal: {
        title: "Internal Server Error",
        description: "Failed to retrieve task history",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You do not have permission to view task history",
      },
      notFound: {
        title: "Not Found",
        description: "Task or execution record not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while fetching task history",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to task history is forbidden",
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
        titleChanges: "Unsaved Changes",
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "History Retrieved",
      description: "Task execution history retrieved successfully",
    },
    log: {
      fetchSuccess: "Successfully fetched {{count}} execution records",
      fetchError: "Failed to fetch task execution history",
    },
    request: {
      title: "Request Parameters",
      description: "Filter task execution history",
    },
    unknownTask: "Unknown Task",
  },
  widget: {
    title: "Task Execution History",
    loading: "Loading history...",
    header: {
      tasks: "Tasks",
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
    search: {
      placeholder: "Search tasks...",
    },
    filter: {
      all: "All",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      timeout: "Timeout",
      cancelled: "Cancelled",
    },
    col: {
      taskName: "Task Name",
      status: "Status",
      duration: "Duration",
      started: "Started",
      completed: "Completed",
      environment: "Environment",
      error: "Error",
    },
    empty: "No execution history found",
    error: {
      collapse: "Collapse error",
    },
    pagination: {
      info: "Page {{page}} of {{totalPages}} ({{total}} total)",
      prev: "Previous",
      next: "Next",
    },
  },
};
