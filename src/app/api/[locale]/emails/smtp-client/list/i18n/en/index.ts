export const translations = {
  title: "SMTP Accounts",
  description: "Get paginated list of SMTP accounts with filtering options",

  container: {
    title: "SMTP Accounts List",
    description: "Browse and filter SMTP accounts",
  },

  fields: {
    campaignType: {
      label: "Campaign Type",
      description: "Filter by campaign type",
    },
    status: {
      label: "Account Status",
      description: "Filter by account status",
    },
    healthStatus: {
      label: "Health Status",
      description: "Filter by health check status",
    },
    search: {
      label: "Search",
      description: "Search by account name or email",
      placeholder: "Search accounts...",
    },
    sortBy: {
      label: "Sort By",
      description: "Sort accounts by field",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort order (ascending or descending)",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
    },
    limit: {
      label: "Limit",
      description: "Number of accounts per page",
    },
  },

  response: {
    account: {
      title: "SMTP Account",
      description: "SMTP account details",
      id: "Account ID",
      name: "Account Name",
      status: "Status",
      healthStatus: "Health Status",
      priority: "Priority",
      totalEmailsSent: "Total Emails Sent",
      lastUsedAt: "Last Used At",
      createdAt: "Created At",
    },
    pagination: {
      title: "Pagination",
      description: "Pagination information",
      page: "Page",
      limit: "Limit",
      total: "Total",
      totalPages: "Total Pages",
    },
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid filter parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required to list SMTP accounts",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access denied",
    },
    notFound: {
      title: "Not Found",
      description: "Resource not found",
    },
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
    server: {
      title: "Server Error",
      description: "Failed to retrieve SMTP accounts",
    },
    networkError: {
      title: "Network Error",
      description: "Network communication failed",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
  },

  success: {
    title: "SMTP Accounts Retrieved",
    description: "Successfully retrieved SMTP accounts list",
  },
  widget: {
    create: "Add Account",
    refresh: "Refresh",
    emptyState: "No SMTP accounts configured",
    priority: "Priority",
    sent: "Sent",
  },
};
