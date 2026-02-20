export const translations = {
  title: "Sync IMAP Messages",
  description: "Synchronize messages from IMAP account folders",

  container: {
    title: "Message Sync Configuration",
    description: "Configure IMAP message synchronization parameters",
  },

  accountId: {
    label: "Account ID",
    description: "IMAP account identifier",
    placeholder: "Enter IMAP account ID",
  },

  folderId: {
    label: "Folder ID",
    description: "Specific folder to sync (optional)",
    placeholder: "Enter folder ID to sync specific folder",
  },

  force: {
    label: "Force Sync",
    description: "Force re-synchronization of all messages",
  },

  response: {
    success: "Success",
    message: "Sync Status Message",

    results: {
      title: "Sync Results",
      description: "Message synchronization statistics",
      messagesProcessed: "Messages Processed",
      messagesAdded: "Messages Added",
      messagesUpdated: "Messages Updated",
      messagesDeleted: "Messages Deleted",
      duration: "Duration (ms)",
    },

    errors: {
      title: "Sync Errors",
      description: "Errors encountered during synchronization",
      error: {
        title: "Error Details",
        description: "Individual error information",
        code: "Error Code",
        message: "Error Message",
      },
    },
  },

  errors: {
    validation: {
      title: "Validation Failed",
      description: "Request parameters are invalid",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required to access this endpoint",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "Insufficient permissions to perform this operation",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred during sync",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    conflict: {
      title: "Conflict Error",
      description: "Data conflict occurred during sync",
    },
    network: {
      title: "Network Error",
      description: "Network error occurred during sync",
    },
    notFound: {
      title: "Not Found",
      description: "Requested resource not found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
  },

  success: {
    title: "Sync Completed",
    description: "IMAP message synchronization completed successfully",
  },
  duration: "Duration",
  widget: {
    title: "Sync Messages",
    result: "Sync Result",
    submit: "Start Sync",
    submitting: "Syncing...",
    duration: "Duration",
  },
};
