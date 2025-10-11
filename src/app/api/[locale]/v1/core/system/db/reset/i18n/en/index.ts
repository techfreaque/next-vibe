import { translations as taskManagementTranslations } from "../../task-management/i18n/en";

export const translations = {
  tag: "reset",
  post: {
    title: "Database Reset",
    description:
      "Reset database by truncating tables, dropping schema, or full initialization",
    form: {
      title: "Reset Configuration",
      description: "Configure database reset options",
    },
    response: {
      title: "Reset Response",
      description: "Results from the database reset operation",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid reset parameters provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for reset operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions for reset operations",
      },
      notFound: {
        title: "Not Found",
        description: "Reset resources not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error during reset",
      },
      network: {
        title: "Network Error",
        description: "Network error during reset operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during reset",
      },
      conflict: {
        title: "Conflict",
        description: "Reset conflict detected",
      },
      database: {
        title: "Database Error",
        description: "Database error during reset operation",
      },
      migration: {
        title: "Migration Error",
        description: "Error running migrations after reset",
      },
      internal: {
        title: "Internal Error",
        description: "Reset operation failed",
      },
    },
    success: {
      title: "Reset Successful",
      description: "Database reset completed successfully",
    },
  },
  fields: {
    mode: {
      title: "Reset Mode",
      description: "Type of reset operation to perform",
      truncate: "Truncate Tables",
      drop: "Drop and Recreate",
      initialize: "Full Initialize",
    },
    force: {
      title: "Force Reset",
      description: "Skip safety checks (required for destructive operations)",
    },
    skipMigrations: {
      title: "Skip Migrations",
      description: "Skip running migrations after reset",
    },
    skipSeeds: {
      title: "Skip Seeds",
      description: "Skip running seed data after reset",
    },
    dryRun: {
      title: "Dry Run",
      description: "Preview reset without making changes",
    },
    success: {
      title: "Success Status",
    },
    tablesAffected: {
      title: "Tables Affected",
    },
    migrationsRun: {
      title: "Migrations Run",
    },
    seedsRun: {
      title: "Seeds Run",
    },
    output: {
      title: "Output",
    },
    operations: {
      title: "Operations",
      item: {
        title: "Operation",
      },
      type: {
        title: "Operation Type",
      },
      status: {
        title: "Status",
      },
      details: {
        title: "Details",
      },
      count: {
        title: "Count",
      },
    },
    isDryRun: {
      title: "Dry Run Mode",
    },
    requiresForce: {
      title: "Requires Force",
    },
    duration: {
      title: "Duration (ms)",
    },
  },
  status: {
    pending: "Pending",
    running: "Running",
    success: "Success",
    failed: "Failed",
    cancelled: "Cancelled",
  },
  taskManagement: taskManagementTranslations,
  messages: {
    dryRun: "DRY RUN: No actual changes were made",
    truncateRequiresForce:
      "Truncate operation requires --force flag for safety",
    noTablesToTruncate: "No tables found to truncate",
    truncatedTables: "Truncated {{count}} tables successfully",
    failedToTruncate: "Failed to truncate tables: {{error}}",
    dropRequiresForce: "Drop operation requires --force flag for safety",
    droppedSchema: "Dropped and recreated schema ({{count}} tables removed)",
    failedToDrop: "Failed to drop and recreate: {{error}}",
    databaseInitialized: "Database initialized successfully {{output}}",
    failedToInitialize: "Failed to initialize database: {{error}}",
    runningMigrations: "Migrations would be run here",
    runningSeeds: "Seeds would be run here",
  },
};
