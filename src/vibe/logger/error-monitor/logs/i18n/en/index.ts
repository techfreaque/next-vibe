export const translations = {
  category: "System",

  errors: {
    repositoryInternalError: "An internal error occurred",
    fetchErrorLogs: "Failed to fetch error logs: {{error}}",
    updateErrorLog: "Failed to update error log status: {{error}}",
    missingTarget: "Pass fingerprint or id.",
    idNotUnique:
      "Id prefix {{id}} matches {{count}} rows. Use the fingerprint or the full id.",
  },

  statusFilter: {
    all: "All",
    active: "Active",
    resolved: "Resolved",
  },

  get: {
    title: "Error Logs",
    titleShort: "Error Logs",
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
        label: "Search errors",
        description: "Search messages, fingerprints, or log IDs",
        placeholder: "Search messages, fingerprints, or log IDs",
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
    titleShort: "Update Log",
    description: "Resolve or reopen an error log by fingerprint",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      fingerprint: {
        label: "Fingerprint",
        description:
          "The fingerprint of the error log (column `fingerprint` in the list). Pass this or id.",
        placeholder: "Enter fingerprint",
      },
      id: {
        label: "Log ID",
        description:
          "The row id from the list (full uuid or its first 8+ characters). Use instead of fingerprint.",
        placeholder: "e.g. c21bd4c7",
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
    emptyFiltered:
      "No groups match these filters. Clear a filter and try again.",
    emptyActive:
      "There are no active error groups. Select All to review resolved errors.",
    severity: {
      error: "Error",
      warning: "Warning",
    },
    title: "Error Logs",
    loading: "Loading logs...",
    empty: "No error logs found",
    header: {
      refresh: "Refresh",
      runScan: "Run Scan",
      back: "Back",
      activeCount: "{{count}} open overall",
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
      confirm: "Save status",
      clear: "Clear filters",
      resolve: "Resolve",
      reopen: "Reopen",
    },
    detail: {
      context: "Error context",
      stackTrace: "Stack Trace",
      metadata: "Metadata",
      collapse: "Collapse",
      resolved: "Resolved",
    },
    pagination: {
      matches: "{{count}} matching groups",
      info: "Page {{page}} of {{totalPages}} ({{total}} total)",
      prev: "Previous",
      next: "Next",
    },
  },
};
