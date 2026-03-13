export const translations = {
  category: "System",

  errors: {
    repositoryInternalError: "An internal error occurred",
    fetchErrorGroups: "Failed to fetch error groups",
    updateErrorGroup: "Failed to update error group status",
  },

  statusFilter: {
    all: "All",
    active: "Active",
    resolved: "Resolved",
  },

  get: {
    title: "Error Groups",
    description:
      "Browse grouped errors by fingerprint with filtering and pagination",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filter by group status",
        placeholder: "All statuses",
      },
      errorType: {
        label: "Error Type",
        description: "Filter by error type (partial match)",
        placeholder: "e.g. INTERNAL_ERROR",
      },
      search: {
        label: "Search",
        description: "Search in error messages",
        placeholder: "Search messages...",
      },
      startDate: {
        label: "From",
        description: "Show groups with errors after this date",
      },
      endDate: {
        label: "To",
        description: "Show groups with errors before this date",
      },
      limit: {
        label: "Limit",
        description: "Number of groups to return",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Number of groups to skip",
        placeholder: "0",
      },
    },
    response: {
      groups: {
        title: "Error Groups",
      },
      totalCount: {
        title: "Total Count",
      },
      hasMore: {
        title: "Has More",
      },
    },
    success: {
      title: "Groups Retrieved",
      description: "Error groups fetched successfully",
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
        description: "No groups found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve error groups",
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
    title: "Update Error Group",
    description: "Resolve or reopen an error group by fingerprint",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      fingerprint: {
        label: "Fingerprint",
        description: "The fingerprint of the error group",
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
      title: "Group Updated",
      description: "Error group status updated successfully",
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
        description: "Error group not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to update error group",
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
    title: "Error Groups",
    loading: "Loading groups...",
    empty: "No error groups found",
    header: {
      refresh: "Refresh",
      activeGroups: "active",
    },
    col: {
      status: "Status",
      message: "Message",
      errorType: "Error Type",
      occurrences: "Occurrences",
      firstSeen: "First Seen",
      lastSeen: "Last Seen",
    },
    status: {
      active: "Active",
      resolved: "Resolved",
    },
    action: {
      resolve: "Resolve",
      reopen: "Reopen",
    },
    pagination: {
      info: "Page {{page}} of {{totalPages}} ({{total}} total)",
      prev: "Previous",
      next: "Next",
    },
  },
};
