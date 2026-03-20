export const translations = {
  category: "Task Management",

  errors: {
    fetchDashboard: "Failed to fetch task dashboard",
    repositoryInternalError: "An internal error occurred",
  },

  widget: {
    title: "Campaign Monitoring",
    refresh: "Refresh",
    health: {
      healthy: "Healthy",
      warning: "Warning",
      critical: "Critical",
    },
    stats: {
      totalTasks: "Total Tasks",
      enabled: "Enabled",
      disabled: "Disabled",
      successRate: "Success Rate (24h)",
      failed24h: "Failed (24h)",
    },
    task: {
      lastRun: "Last run",
      nextRun: "Next run",
      never: "Never",
      executions: "Executions",
      avgDuration: "Avg",
      noHistory: "No executions yet",
      runNow: "Run now",
    },
    status: {
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      error: "Error",
      timeout: "Timeout",
      pending: "Pending",
      scheduled: "Scheduled",
      cancelled: "Cancelled",
      unknown: "Unknown",
    },
    alerts: {
      title: "Alerts",
      failures: "consecutive failures",
    },
    empty: "No campaign tasks found",
    loading: "Loading monitoring data...",
  },

  get: {
    tags: {
      tasks: "Tasks",
      monitoring: "Monitoring",
    },
    title: "Task Dashboard",
    description:
      "Unified view of all scheduled tasks with recent execution history, failure alerts, and system health — replaces the need to call cron-list, cron-history, and cron-stats separately.",
    fields: {
      limit: {
        label: "Task Limit",
        description: "Maximum number of tasks to return",
      },
      historyDepth: {
        label: "History Depth",
        description: "Number of recent executions to include per task",
      },
    },
    response: {
      tasks: { title: "Tasks with recent executions" },
      campaignTasks: { title: "Campaign tasks" },
      alerts: { title: "Failure alerts for critical/high priority tasks" },
      stats: { title: "Aggregate statistics" },
    },
    success: {
      title: "Dashboard loaded",
      description: "Task dashboard data retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      notFound: {
        title: "Not Found",
        description: "Dashboard data not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
  },
};
