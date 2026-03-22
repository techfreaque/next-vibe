export const translations = {
  category: "System",

  errors: {
    repositoryInternalError: "An internal error occurred",
    fetchErrorLogs: "Failed to fetch error logs",
    updateErrorLog: "Failed to update error log status",
  },

  statusFilter: {
    all: "All",
    active: "Active",
    resolved: "Resolved",
  },

  get: {
    title: "Error Logs",
    description: "Browse backend error logs with filtering and pagination",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filter by resolved status",
      },
      search: {
        label: "Search",
        description: "Search in error messages",
        placeholder: "Search messages...",
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
      unresolvedCount: {
        title: "Unresolved Count",
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

  patch: {
    title: "Update Error Log",
    description: "Resolve or reopen an error log by fingerprint",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      fingerprint: {
        label: "Fingerprint",
        description: "The fingerprint of the error log",
        placeholder: "Enter fingerprint",
      },
      resolved: {
        label: "Resolved",
        description: "Set to true to resolve, false to reopen",
      },
    },
    response: {
      fingerprint: {
        title: "Fingerprint",
      },
      resolved: {
        title: "Resolved",
      },
      affectedRows: {
        title: "Affected Rows",
      },
    },
    success: {
      title: "Log Updated",
      description: "Error log status updated successfully",
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
        description: "Error log not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to update error log",
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

  post: {
    title: "Run Error Monitor Scan",
    description: "Scan chat messages and backend logs for error patterns",
    tags: {
      monitoring: "Monitoring",
    },
    response: {
      errorsFound: "Errors Found",
      threadsScanned: "Threads Scanned",
      scanWindowFrom: "Scan Window From",
      scanWindowTo: "Scan Window To",
      patterns: "Error Patterns",
    },
    success: {
      title: "Scan Complete",
      description: "Error monitor scan completed successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
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
        description: "Resource not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to run error monitor scan",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
  },

  errorMonitor: {
    name: "Error Monitor",
    description: "Scans for error patterns every 3 hours",
  },

  widget: {
    title: "Error Logs",
    loading: "Loading logs...",
    empty: "No error logs found",
    header: {
      refresh: "Refresh",
      runScan: "Run Scan",
      back: "Back",
      activeCount: "active",
    },
    col: {
      message: "Message",
      errorType: "Error Type",
      occurrences: "Occurrences",
      firstSeen: "First Seen",
      createdAt: "Last Seen",
    },
    status: {
      active: "Active",
      resolved: "Resolved",
    },
    action: {
      resolve: "Resolve",
      reopen: "Reopen",
    },
    detail: {
      stackTrace: "Stack Trace",
      metadata: "Metadata",
      collapse: "Collapse",
      resolved: "Resolved",
    },
    pagination: {
      info: "Page {{page}} of {{totalPages}} ({{total}} total)",
      prev: "Previous",
      next: "Next",
    },
  },
};
