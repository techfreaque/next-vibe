export const translations = {
  title: "Migration Task Management",
  description: "Manage database migration tasks and monitoring",
  category: "Migration Tasks",
  tags: {
    migration: "Migration",
    tasks: "Tasks",
    taskmanagement: "Task Management",
  },
  container: {
    title: "Migration Task Management",
    description: "Control and monitor database migration tasks",
  },
  fields: {
    operation: {
      label: "Task Operation",
      description: "Select the migration task operation to perform",
      placeholder: "Choose a migration task operation",
    },
    taskName: {
      label: "Task Name",
      description: "Name of the specific migration task",
      placeholder: "Enter task name (optional)",
    },
    options: {
      label: "Task Options",
      description: "Configuration options for the migration task",
      placeholder: "Configure task execution options",
    },
  },
  operations: {
    getMigrationStatus: "Get Migration Status",
    listMigrationTasks: "List Migration Tasks",
    runHealthCheck: "Run Health Check",
    startAutoMigration: "Start Auto Migration",
    startBackupMonitor: "Start Backup Monitor",
    stopAutoMigration: "Stop Auto Migration",
    stopBackupMonitor: "Stop Backup Monitor",
  },
  response: {
    success: {
      label: "Operation Success",
    },
    taskExecuted: {
      label: "Task Executed",
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
      description: "Invalid migration task parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required for migration task operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Insufficient permissions for migration task operations",
    },
    internal: {
      title: "Task Error",
      description: "Migration task execution failed",
    },
    conflict: {
      title: "Conflict Error",
      description: "Migration task conflict occurred",
    },
    networkError: {
      title: "Network Error",
      description: "Network error during migration task operation",
    },
    notFound: {
      title: "Not Found",
      description: "Migration task not found",
    },
    unknownError: {
      title: "Unknown Error",
      description: "An unknown error occurred during migration task operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes in the migration task",
    },
  },
  priority: {
    low: "Low Priority",
    medium: "Medium Priority",
    high: "High Priority",
  },
  success: {
    title: "Migration Task Successful",
    description: "Migration task operation completed successfully",
  },
  messages: {
    healthCheckCompleted:
      "Health check completed: {migrationsChecked} migrations checked, {pendingMigrations} pending",
    healthCheckFailed: "Database migration health check failed",
    autoMigrationSkippedNotDevelopment:
      "Auto migration skipped - not in development environment",
    operationOnlyAllowedInDevelopment:
      "This operation is only allowed in development environment",
    autoMigrationTaskNotFound: "Auto migration task not found",
    taskConfigurationMissing: "Task configuration missing",
    autoMigrationStartedSuccessfully: "Auto migration started successfully",
    failedToStartAutoMigration: "Failed to start auto migration",
    backupMonitorTaskNotFound: "Backup monitor task not found",
    backupMonitorStartedSuccessfully: "Backup monitor started successfully",
    failedToStartBackupMonitor: "Failed to start backup monitor",
    autoMigrationStoppedSuccessfully: "Auto migration stopped successfully",
    failedToStopAutoMigrationTask: "Failed to stop auto migration task",
    backupMonitorStoppedSuccessfully: "Backup monitor stopped successfully",
    failedToStopBackupMonitorTask: "Failed to stop backup monitor task",
    migrationTaskNotFound: "Migration task not found",
    migrationTaskDoesNotExist: "Migration task '{taskName}' does not exist",
    migrationTaskStatusRetrieved:
      "Migration task '{taskName}' status retrieved successfully",
    failedToGetMigrationTaskStatus: "Failed to get migration task status",
    foundMigrationTasks: "Found {{count}} migration tasks",
    failedToListMigrationTasks: "Failed to list migration tasks",
  },
  tasks: {
    healthCheck: {
      description:
        "Performs health checks on database migrations to ensure system integrity",
      schedule: "0 */6 * * *",
    },
    autoMigration: {
      description:
        "Automatically runs pending database migrations in development environment",
      schedule: "*/30 * * * *",
    },
    backupMonitor: {
      description:
        "Monitors and manages database migration backup files and cleanup",
    },
  },
};
