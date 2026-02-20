export const translations = {
  title: "Messaging Accounts",
  description: "Manage SMS, WhatsApp, and Telegram provider accounts",

  fields: {
    channel: {
      label: "Channel",
      description: "Filter by messaging channel",
    },
    status: {
      label: "Status",
      description: "Filter by account status",
    },
    search: {
      label: "Search",
      description: "Search by account name",
      placeholder: "Search accounts...",
    },
    page: { label: "Page", description: "Page number" },
    limit: { label: "Limit", description: "Accounts per page" },
  },

  response: {
    account: {
      title: "Messaging Account",
      description: "Messaging provider account details",
      id: "ID",
      name: "Name",
      channel: "Channel",
      provider: "Provider",
      fromId: "From",
      status: "Status",
      messagesSentTotal: "Total Sent",
      lastUsedAt: "Last Used",
      createdAt: "Created",
    },
    pagination: {
      title: "Pagination",
      description: "Pagination info",
      page: "Page",
      limit: "Limit",
      total: "Total",
      totalPages: "Total Pages",
    },
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required",
    },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not Found", description: "Resource not found" },
    conflict: { title: "Conflict", description: "Data conflict" },
    server: {
      title: "Server Error",
      description: "Failed to retrieve accounts",
    },
    networkError: { title: "Network Error", description: "Network error" },
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
    title: "Accounts Retrieved",
    description: "Successfully retrieved messaging accounts",
  },

  widget: {
    create: "Add Account",
    refresh: "Refresh",
    emptyState: "No messaging accounts configured",
    sent: "Sent",
    searchPlaceholder: "Search accounts...",
  },
};
