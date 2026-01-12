export const translations = {
  title: "Reset Task Management",
  description: "Manage database reset tasks and monitoring",
  category: "Reset Tasks",
  tags: {
    tasks: "Tasks",
    management: "Management",
    reset: "Reset",
    taskmanagement: "Task Management",
  },
  container: {
    title: "Reset Task Management",
    description: "Control and monitor database reset tasks",
  },
  fields: {
    operation: {
      label: "Task Operation",
      description: "Select the reset task operation to perform",
      placeholder: "Choose a reset task operation",
    },
    taskName: {
      label: "Task Name",
      description: "Name of the specific reset task",
      placeholder: "Enter task name (optional)",
    },
    options: {
      label: "Task Options",
      description: "Configuration options for the reset task",
      placeholder: "Configure task execution options",
    },
  },
  operations: {
    runSafetyCheck: "Run Safety Check",
    startAutoReset: "Start Auto Reset",
    startBackupVerification: "Start Backup Verification",
    stopAutoReset: "Stop Auto Reset",
    stopBackupVerification: "Stop Backup Verification",
    getStatus: "Get Status",
    listTasks: "List Tasks",
  },
  response: {
    success: {
      label: "Operation Success",
    },
    taskName: {
      label: "Task Name",
    },
    status: {
      label: "Task Status",
    },
    output: {
      label: "Task Output",
    },
    error: {
      label: "Error Details",
    },
    result: {
      label: "Task Result",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid reset task parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required for reset task operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Insufficient permissions for reset task operations",
    },
    internal: {
      title: "Task Error",
      description: "Reset task execution failed",
    },
    conflict: {
      title: "Conflict Error",
      description: "Reset task conflict occurred",
    },
    networkError: {
      title: "Network Error",
      description: "Network error during reset task operation",
    },
    notFound: {
      title: "Not Found",
      description: "Reset task not found",
    },
    unknownError: {
      title: "Unknown Error",
      description: "An unknown error occurred during reset task operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes in the reset task",
    },
    timeout: {
      title: "Timeout Error",
      description: "Reset task operation exceeded timeout limit",
    },
  },
  priority: {
    low: "Low Priority",
    medium: "Medium Priority",
    high: "High Priority",
  },
  success: {
    title: "Reset Task Successful",
    description: "Reset task operation completed successfully",
  },
  messages: {
    noUnauthorizedResetOperations: "No unauthorized reset operations detected",
    safetyCheckSkippedNotProduction: "Safety check skipped (not in production)",
    safetyCheckFailed: "Database reset safety check failed",
    autoResetSkippedNotDevelopment: "Auto reset skipped (not in development)",
    operationOnlyAllowedInDevelopment:
      "Operation only allowed in development environment",
    autoResetTaskNotFound: "Auto-reset task not found",
    taskConfigurationMissing: "Task configuration missing",
    autoResetStartedSuccessfully:
      "Development database auto-reset task started successfully",
    failedToStartAutoReset: "Failed to start auto-reset task",
    backupVerificationTaskNotFound: "Backup verification task not found",
    backupVerificationStartedSuccessfully:
      "Database backup verification started successfully",
    failedToStartBackupVerification: "Failed to start backup verification",
    autoResetStoppedSuccessfully: "Auto-reset task stopped successfully",
    failedToStopAutoReset: "Failed to stop auto-reset task",
    backupVerificationStoppedSuccessfully:
      "Backup verification task stopped successfully",
    failedToStopBackupVerification: "Failed to stop backup verification task",
    taskNotFound: "Task not found",
    taskDoesNotExist: "Task '{taskName}' does not exist",
    taskStatusRetrieved: "Task '{taskName}' status retrieved",
    failedToGetTaskStatus: "Failed to get task status",
    foundTasks: "Found {count} tasks",
    failedToListTasks: "Failed to list tasks",
  },
  tasks: {
    resetSafetyCheck: {
      description: "Monitor for accidental database resets in production",
      schedule: "0 */12 * * *",
    },
    devAutoReset: {
      description: "Automatically reset development database on schedule",
      schedule: "0 6 * * 1",
    },
    backupVerification: {
      description: "Verify database backups before allowing resets",
    },
  },
};
