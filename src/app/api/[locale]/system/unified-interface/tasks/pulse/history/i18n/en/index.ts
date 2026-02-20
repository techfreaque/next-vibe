export const translations = {
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
};
