export const translations = {
  title: "List IMAP Accounts",
  description: "Retrieve a paginated list of IMAP accounts with filtering",
  container: {
    title: "IMAP Accounts List",
    description: "Configure IMAP account list parameters and view results",
  },
  fields: {
    page: {
      label: "Page",
      description: "Page number for pagination",
      placeholder: "Enter page number",
    },
    limit: {
      label: "Limit",
      description: "Number of items per page",
      placeholder: "Enter limit",
    },
    search: {
      label: "Search",
      description: "Search accounts by name or email",
      placeholder: "Search accounts...",
    },
    status: {
      label: "Status",
      description: "Filter by account status",
      placeholder: "Select status",
    },
    enabled: {
      label: "Enabled",
      description: "Filter by enabled status",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort by",
      placeholder: "Select sort field",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort order direction",
      placeholder: "Select sort order",
    },
  },
  response: {
    accounts: {
      title: "IMAP Accounts",
      emptyState: {
        title: "No accounts found",
        description: "No IMAP accounts match your current filters",
      },
      item: {
        title: "IMAP Account",
        description: "IMAP account details",
        id: "ID",
        name: "Name",
        email: "Email",
        host: "Host",
        port: "Port",
        secure: "Secure",
        username: "Username",
        authMethod: "Auth Method",
        connectionTimeout: "Connection Timeout",
        keepAlive: "Keep Alive",
        enabled: "Enabled",
        syncInterval: "Sync Interval",
        maxMessages: "Max Messages",
        syncFolders: "Sync Folders",
        lastSyncAt: "Last Sync At",
        syncStatus: "Sync Status",
        syncError: "Sync Error",
        isConnected: "Is Connected",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    pagination: {
      title: "Pagination",
      description: "Pagination information",
      page: "Current Page",
      limit: "Items Per Page",
      total: "Total Items",
      totalPages: "Total Pages",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "The provided parameters are invalid",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be authenticated to access this resource",
    },
    forbidden: {
      title: "Forbidden",
      description: "You do not have permission to access this resource",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    server: {
      title: "Server Error",
      description: "An internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "The request conflicts with the current state",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred",
    },
  },
  success: {
    title: "Success",
    description: "IMAP accounts retrieved successfully",
  },
  widget: {
    title: "IMAP Accounts",
    create: "Add Account",
    refresh: "Refresh",
    empty: "No IMAP accounts configured",
    disabled: "Disabled",
    lastSync: "Last sync",
  },
};
