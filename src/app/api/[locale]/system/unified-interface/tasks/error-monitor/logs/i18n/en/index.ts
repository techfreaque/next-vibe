export const translations = {
  category: "System",

  errors: {
    repositoryInternalError: "An internal error occurred",
    fetchErrorLogs: "Failed to fetch error logs",
  },

  get: {
    title: "Error Logs",
    description: "Browse backend error logs with filtering and pagination",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      source: {
        label: "Source",
        description: "Filter by error source",
        placeholder: "backend, task, chat",
      },
      level: {
        label: "Level",
        description: "Filter by error level",
        placeholder: "error, warn",
      },
      endpoint: {
        label: "Endpoint",
        description: "Filter by endpoint path (partial match)",
        placeholder: "Enter endpoint",
      },
      errorType: {
        label: "Error Type",
        description: "Filter by error type classification",
        placeholder: "e.g. INTERNAL_ERROR",
      },
      startDate: {
        label: "From",
        description: "Show errors after this date",
      },
      endDate: {
        label: "To",
        description: "Show errors before this date",
      },
      limit: {
        label: "Limit",
        description: "Number of results to return",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Number of results to skip",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Error Log Entries",
      },
      totalCount: {
        title: "Total Count",
      },
      hasMore: {
        title: "Has More",
      },
    },
    success: {
      title: "Logs Retrieved",
      description: "Error logs fetched successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "No logs found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve error logs",
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
  },

  widget: {
    title: "Error Logs",
    loading: "Loading logs...",
    empty: "No error logs found",
    header: {
      refresh: "Refresh",
      runScan: "Run Scan",
    },
    col: {
      level: "Level",
      source: "Source",
      message: "Message",
      endpoint: "Endpoint",
      errorType: "Error Type",
      createdAt: "Time",
    },
    detail: {
      stackTrace: "Stack Trace",
      metadata: "Metadata",
      collapse: "Collapse",
    },
    pagination: {
      info: "Page {{page}} of {{totalPages}} ({{total}} total)",
      prev: "Previous",
      next: "Next",
    },
  },
};
