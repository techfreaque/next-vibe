export const translations = {
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
};
