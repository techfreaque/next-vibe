export const translations = {
  get: {
    title: "Get IMAP Account",
    description: "Retrieve a specific IMAP account by ID",
    container: {
      title: "IMAP Account Details",
      description: "View and manage IMAP account information",
    },
    id: {
      label: "Account ID",
      description: "Unique identifier for the IMAP account",
    },
    response: {
      account: {
        title: "IMAP Account Information",
        description: "Detailed information about the IMAP account",
        id: "Account ID",
        name: "Account Name",
        email: "Email Address",
        host: "IMAP Server Host",
        port: "IMAP Server Port",
        secure: "Secure Connection",
        username: "Username",
        authMethod: "Authentication Method",
        connectionTimeout: "Connection Timeout (ms)",
        keepAlive: "Keep Connection Alive",
        enabled: "Account Enabled",
        syncInterval: "Sync Interval (seconds)",
        maxMessages: "Maximum Messages",
        syncFolders: "Synchronized Folders",
        lastSyncAt: "Last Synchronization",
        syncStatus: "Sync Status",
        syncError: "Sync Error",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid account ID provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You don't have permission to access this account",
      },
      notFound: {
        title: "Account Not Found",
        description: "The requested IMAP account could not be found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Conflict Error",
        description: "A conflict occurred while processing the request",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "IMAP account retrieved successfully",
    },
  },
  post: {
    title: "Update IMAP Account",
    description: "Update an existing IMAP account",
    form: {
      title: "Update Account Configuration",
      description: "Configure IMAP account parameters",
      name: {
        label: "Account Name",
        description: "Display name for the IMAP account",
      },
      email: {
        label: "Email Address",
        description: "Email address for the IMAP account",
      },
      host: {
        label: "IMAP Server Host",
        description: "IMAP server hostname or IP address",
      },
      port: {
        label: "IMAP Server Port",
        description: "IMAP server port number (typically 143 or 993)",
      },
      secure: {
        label: "Use Secure Connection",
        description: "Enable SSL/TLS encryption for the connection",
      },
      username: {
        label: "Username",
        description: "Username for IMAP authentication",
      },
      password: {
        label: "Password",
        description: "Password for IMAP authentication",
      },
      authMethod: {
        label: "Authentication Method",
        description: "Method used for IMAP authentication",
      },
      enabled: {
        label: "Account Enabled",
        description: "Enable or disable this IMAP account",
      },
      connectionTimeout: {
        label: "Connection Timeout",
        description: "Connection timeout in milliseconds",
      },
      keepAlive: {
        label: "Keep Alive",
        description: "Keep the connection alive between requests",
      },
      syncInterval: {
        label: "Sync Interval",
        description: "Synchronization interval in seconds",
      },
      maxMessages: {
        label: "Maximum Messages",
        description: "Maximum number of messages to sync",
      },
      syncFolders: {
        label: "Sync Folders",
        description: "Folders to synchronize (comma-separated)",
      },
    },
    response: {
      title: "Updated Account",
      description: "IMAP account response data",
      account: {
        id: "Account ID",
        name: "Account Name",
        email: "Email Address",
        host: "IMAP Server Host",
        port: "IMAP Server Port",
        secure: "Secure Connection",
        username: "Username",
        authMethod: "Authentication Method",
        enabled: "Account Enabled",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  delete: {
    title: "Delete IMAP Account",
    description: "Delete an existing IMAP account",
    container: {
      title: "Delete Account",
      description: "Permanently remove this IMAP account",
    },
    response: {
      message: "Account deleted successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      notFound: {
        title: "Account Not Found",
        description: "The IMAP account could not be found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      conflict: {
        title: "Conflict",
        description: "Cannot delete account with active connections",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while deleting account",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while deleting",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Cannot delete account with unsaved changes",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid account ID provided",
      },
    },
    success: {
      title: "Success",
      description: "Account deleted successfully",
    },
  },
};
