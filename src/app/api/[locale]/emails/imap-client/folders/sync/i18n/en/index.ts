export const translations = {
  title: "Sync IMAP Folders",
  description: "Synchronize folders from IMAP account",

  container: {
    title: "Folder Sync Configuration",
    description: "Configure IMAP folder synchronization parameters",
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
    description: "Force re-synchronization of all folders",
  },

  response: {
    foldersProcessed: "Folders Processed",
    foldersAdded: "Folders Added",
    foldersUpdated: "Folders Updated",
    foldersDeleted: "Folders Deleted",
    duration: "Duration (ms)",
    success: "Success",
  },

  info: {
    start: "Starting folder synchronization",
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
    description: "IMAP folder synchronization completed successfully",
  },
  widget: {
    title: "Sync Folders",
    result: "Sync Result",
    duration: "Duration",
    foldersProcessed: "Folders Processed",
    foldersAdded: "Folders Added",
    foldersUpdated: "Folders Updated",
    foldersDeleted: "Folders Deleted",
    submit: "Start Sync",
    submitting: "Syncing...",
  },
};
