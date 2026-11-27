export const translations = {
  category: "Pulse status",
  tags: {
    status: "Status",
  },
  get: {
    title: "Pulse status",
    titleShort: "Pulse status",
    description: "Review pulse runs and their success rate.",
    container: {
      title: "Pulse Health Status",
      description: "Monitor pulse execution health and statistics",
    },
    widget: {
      refresh: "Refresh",
      noData: "No runs yet",
    },
    fields: {
      status: {
        title: "Status",
        label: "Pulse status",
        description: "Current pulse health status",
      },
      lastPulseAt: {
        title: "Last Pulse At",
        label: "Last pulse",
        description: "Timestamp of last pulse execution",
      },
      successRate: {
        title: "Success rate",
        label: "Success rate",
        description: "Percentage of successful pulse executions",
      },
      totalExecutions: {
        title: "Total executions",
        label: "Total executions",
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
};
