export const translations = {
  get: {
    title: "Get Cron Task Statistics",
    description: "Retrieve comprehensive statistics and metrics for cron tasks",
    tag: "Cron Statistics",
    form: {
      title: "Cron Statistics Request",
      description: "Configure parameters for retrieving cron task statistics",
    },
    fields: {
      period: {
        title: "Time Period",
        description: "Time period for statistics aggregation",
      },
      type: {
        title: "Statistics Type",
        description: "Type of statistics to retrieve",
      },
      taskId: {
        title: "Task ID",
        description: "Optional specific task ID to filter statistics",
      },
      limit: {
        title: "Result Limit",
        description: "Maximum number of results to return",
      },
      timePeriod: {
        title: "Time Period",
      },
      dateRangePreset: {
        title: "Date Range Preset",
      },
      taskName: {
        title: "Task Name",
      },
      taskStatus: {
        title: "Task Status",
      },
      taskPriority: {
        title: "Task Priority",
      },
      healthStatus: {
        title: "Health Status",
      },
      minDuration: {
        title: "Minimum Duration",
      },
      maxDuration: {
        title: "Maximum Duration",
      },
      includeDisabled: {
        title: "Include Disabled",
      },
      includeSystemTasks: {
        title: "Include System Tasks",
      },
      hasRecentFailures: {
        title: "Has Recent Failures",
      },
      hasTimeout: {
        title: "Has Timeout",
      },
      search: {
        title: "Search",
      },
    },
    period: {
      hour: "Hourly",
      day: "Daily",
      week: "Weekly",
      month: "Monthly",
    },
    type: {
      overview: "Overview",
      performance: "Performance",
      errors: "Error Analysis",
      trends: "Trend Analysis",
    },
    response: {
      totalTasks: { title: "Total Tasks" },
      executedTasks: { title: "Executed Tasks" },
      successfulTasks: { title: "Successful Tasks" },
      failedTasks: { title: "Failed Tasks" },
      averageExecutionTime: { title: "Avg Execution Time (ms)" },
      totalExecutions: { title: "Total Executions" },
      executionsLast24h: { title: "Executions Last 24h" },
      successRate: { title: "Success Rate (%)" },
      successfulExecutions: { title: "Successful Executions" },
      failedExecutions: { title: "Failed Executions" },
      failureRate: { title: "Failure Rate (%)" },
      avgExecutionTime: { title: "Avg Execution Time (ms)" },
      minExecutionTime: { title: "Min Execution Time (ms)" },
      maxExecutionTime: { title: "Max Execution Time (ms)" },
      medianExecutionTime: { title: "Median Execution Time (ms)" },
      pendingExecutions: { title: "Pending Executions" },
      runningExecutions: { title: "Running Executions" },
      activeTasks: { title: "Active Tasks" },
      healthyTasks: { title: "Healthy Tasks" },
      degradedTasks: { title: "Degraded Tasks" },
      systemLoad: { title: "System Load (%)" },
      queueSize: { title: "Queue Size" },
    },
    errors: {
      server: {
        title: "Server Error",
        description:
          "An internal server error occurred while retrieving statistics",
      },
      validation: {
        title: "Validation Error",
        description: "The provided parameters are invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access statistics",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions to access statistics",
      },
      notFound: {
        title: "Not Found",
        description: "The requested statistics could not be found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while processing the request",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while retrieving statistics",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be addressed",
      },
    },
    success: {
      title: "Statistics Retrieved",
      description: "Cron task statistics retrieved successfully",
    },
  },
  widget: {
    title: "Cron Statistics",
    loading: "Loading statistics...",
    viewTasks: "Tasks",
    viewHistory: "History",
    refresh: "Refresh",
    totalTasks: "Total Tasks",
    executedTasks: "Executed Tasks",
    successfulTasks: "Successful",
    failedTasks: "Failed",
    successRate: "Success Rate",
    avgDuration: "Avg Duration",
    overallSuccessRate: "Overall Success Rate",
    activeTasks: "Active Tasks",
    runningExecutions: "Running",
    pendingExecutions: "Pending",
    healthyTasks: "Healthy Tasks",
    degradedTasks: "Degraded Tasks",
    systemLoad: "System Load",
    queueSize: "Queue Size",
    executionsLast24h: "Last 24h",
    tasksByStatus: "Tasks by Status",
    tasksByPriority: "Tasks by Priority",
    topPerforming: "Top Performing Tasks",
    problemTasks: "Problem Tasks",
    recentActivity: "Recent Activity",
    dailyStats: "Daily Statistics",
    col: {
      rank: "#",
      taskName: "Task Name",
      executions: "Executions",
      avgDuration: "Avg Duration",
      failures: "Failures",
      failureRate: "Failure Rate",
      date: "Date",
      successes: "Successes",
      uniqueTasks: "Unique Tasks",
    },
  },
};
