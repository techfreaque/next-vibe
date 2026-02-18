export const translations = {
  title: "Create IMAP Account",
  description: "Create a new IMAP account for email management",
  category: "IMAP Management",
  tags: {
    create: "Create",
  },
  container: {
    title: "New IMAP Account",
    description: "Configure a new IMAP account for email synchronization",
  },
  name: {
    label: "Account Name",
    description: "Display name for the IMAP account",
    placeholder: "Enter account name",
  },
  email: {
    label: "Email Address",
    description: "Email address for the IMAP account",
    placeholder: "user@example.com",
  },
  host: {
    label: "IMAP Server Host",
    description: "IMAP server hostname or IP address",
    placeholder: "imap.example.com",
  },
  port: {
    label: "IMAP Server Port",
    description: "IMAP server port number (typically 143 or 993)",
    placeholder: "993",
  },
  secure: {
    label: "Use Secure Connection",
    description: "Enable SSL/TLS encryption for the connection",
    placeholder: "true",
  },
  username: {
    label: "Username",
    description: "Username for IMAP authentication",
    placeholder: "Enter username",
  },
  password: {
    label: "Password",
    description: "Password for IMAP authentication",
    placeholder: "Enter password",
  },
  authMethod: {
    label: "Authentication Method",
    description: "Method used for IMAP authentication",
    placeholder: "Select authentication method",
  },
  connectionTimeout: {
    label: "Connection Timeout",
    description: "Connection timeout in milliseconds",
    placeholder: "30000",
  },
  keepAlive: {
    label: "Keep Alive",
    description: "Keep the connection alive between requests",
  },
  enabled: {
    label: "Account Enabled",
    description: "Enable or disable this IMAP account",
  },
  syncInterval: {
    label: "Sync Interval",
    description: "Synchronization interval in seconds",
    placeholder: "300",
  },
  maxMessages: {
    label: "Maximum Messages",
    description: "Maximum number of messages to sync",
    placeholder: "1000",
  },
  syncFolders: {
    label: "Sync Folders",
    description: "Folders to synchronize (comma-separated)",
    placeholder: "INBOX, Sent, Drafts",
  },
  response: {
    title: "Created Account",
    description: "IMAP account creation response",

    accountSummary: {
      title: "Account Summary",
      description: "Basic account information",
    },

    connectionDetails: {
      title: "Connection Details",
      description: "IMAP server connection settings",
    },

    syncConfiguration: {
      title: "Sync Configuration",
      description: "Email synchronization settings",
    },

    id: {
      title: "Account ID",
      label: "ID",
    },
    name: {
      title: "Account Name",
      label: "Name",
    },
    email: {
      title: "Email Address",
      label: "Email",
    },
    host: {
      title: "IMAP Server Host",
      label: "Host",
    },
    port: {
      title: "IMAP Server Port",
      label: "Port",
    },
    secure: {
      title: "Secure Connection",
      label: "Secure",
    },
    username: {
      title: "Username",
      label: "Username",
    },
    authMethod: {
      title: "Authentication Method",
      label: "Auth Method",
    },
    connectionTimeout: {
      title: "Connection Timeout (ms)",
      label: "Timeout",
    },
    keepAlive: {
      title: "Keep Connection Alive",
      label: "Keep Alive",
    },
    enabled: {
      title: "Account Enabled",
      label: "Enabled",
    },
    syncStatus: {
      title: "Sync Status",
      label: "Status",
    },
    syncInterval: {
      title: "Sync Interval (seconds)",
      label: "Interval",
    },
    maxMessages: {
      title: "Maximum Messages",
      label: "Max Messages",
    },
    syncFolders: {
      title: "Synchronized Folders",
      label: "Folders",
    },
    lastSyncAt: "Last Synchronization",
    syncError: "Sync Error",
    isConnected: "Connection Status",
    createdAt: "Created At",
    updatedAt: "Updated At",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid parameters provided",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    conflict: {
      title: "Conflict Error",
      description: "Account with this configuration already exists",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access denied",
    },
    network: {
      title: "Network Error",
      description: "Network connection failed",
    },
    notFound: {
      title: "Not Found",
      description: "Resource not found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
  },
  success: {
    title: "Success",
    description: "IMAP account created successfully",
  },
  widget: {
    title: "Create IMAP Account",
    basicInfo: "Basic Info",
    serverConnection: "Server Connection",
    authentication: "Authentication",
    syncConfiguration: "Sync Configuration",
  },
};
