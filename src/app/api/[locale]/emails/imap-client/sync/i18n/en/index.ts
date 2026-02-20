export const translations = {
  title: "IMAP Sync",
  description: "IMAP synchronization service",
  container: {
    title: "IMAP Sync Configuration",
    description: "Configure IMAP synchronization parameters",
  },
  accountIds: {
    label: "Account IDs",
    description: "IMAP account IDs to sync",
    placeholder: "Enter account IDs separated by commas",
  },
  force: {
    label: "Force Sync",
    description: "Force synchronization even if recently synced",
  },
  dryRun: {
    label: "Dry Run",
    description: "Perform a test run without making changes",
  },
  maxMessages: {
    label: "Max Messages",
    description: "Maximum number of messages to sync per folder",
    placeholder: "Enter maximum number of messages",
  },
  post: {
    title: "Sync",
    description: "Sync endpoint",
    form: {
      title: "Sync Configuration",
      description: "Configure sync parameters",
    },
    response: {
      title: "Response",
      description: "Sync response data",
      result: {
        title: "Sync Results",
        description: "Detailed synchronization results",
        accountsProcessed: "Accounts Processed",
        foldersProcessed: "Folders Processed",
        messagesProcessed: "Messages Processed",
        messagesAdded: "Messages Added",
        messagesUpdated: "Messages Updated",
        messagesDeleted: "Messages Deleted",
        duration: "Duration",
      },
      errors: {
        error: {
          title: "Sync Error",
          description: "Error details",
          code: "Error Code",
          message: "Error Message",
        },
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
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
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
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
  },
  success: {
    title: "Success",
    description: "Operation completed successfully",
  },
  widget: {
    title: "Full IMAP Sync",
    options: "Sync Options",
    result: "Sync Result",
    duration: "Duration",
    errors: "Errors",
    accountsProcessed: "Accounts Processed",
    foldersProcessed: "Folders Processed",
    messagesProcessed: "Messages Processed",
    messagesAdded: "Messages Added",
    messagesUpdated: "Messages Updated",
    messagesDeleted: "Messages Deleted",
    submit: "Start Sync",
    submitting: "Syncing...",
  },
};
