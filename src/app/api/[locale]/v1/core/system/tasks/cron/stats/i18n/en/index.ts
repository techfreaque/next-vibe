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
      success: {
        title: "Request Success Status",
      },
      data: {
        title: "Statistics Data",
      },
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
};
