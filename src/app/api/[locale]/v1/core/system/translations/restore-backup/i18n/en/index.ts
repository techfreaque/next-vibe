export const translations = {
  post: {
    title: "Restore Translation Backup",
    description: "Restore translation files from a backup",
    container: {
      title: "Restore Backup",
      description: "Restore translation files from a specified backup",
    },
    fields: {
      backupPath: {
        title: "Backup Path",
        description: "Path to the backup directory to restore from",
      },
      validateOnly: {
        title: "Validate Only",
        description: "Only validate the backup without restoring",
      },
      createBackupBeforeRestore: {
        title: "Create Backup Before Restore",
        description: "Create a backup of current state before restoring",
      },
    },
    messages: {
      validationSuccessful:
        "Backup validation successful - backup is valid and can be restored",
      restoreSuccessful: "Backup restored successfully",
      backupNotFound: "Backup not found at specified path",
    },
    response: {
      title: "Restore Result",
      description: "Backup restoration results",
      message: "Restoration Message",
      backupInfo: {
        title: "Backup Information",
        description: "Information about the restored backup",
        backupPath: "Backup Path",
        backupDate: "Backup Date",
        filesRestored: "Files Restored",
        newBackupCreated: "New Backup Created",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid backup path or parameters",
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
        title: "Backup Not Found",
        description: "The specified backup does not exist",
      },
      conflict: {
        title: "Conflict",
        description: "Backup restoration conflict occurred",
      },
    },
    success: {
      title: "Backup Restored",
      description: "Translation backup restored successfully",
    },
  },
};
