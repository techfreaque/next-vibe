import { translations as taskManagementTranslations } from "../../task-management/i18n/en";

export const translations = {
  tag: "migration",
  post: {
    title: "Database Migration",
    description: "Run database migrations",
    form: {
      title: "Migration Configuration",
      description: "Configure database migration options",
    },
    response: {
      title: "Migration Response",
      description: "Migration operation results",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid migration parameters",
      },
      internal: {
        title: "Internal Error",
        description: "Migration operation failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for migration operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions for migration operations",
      },
      notFound: {
        title: "Not Found",
        description: "Migration resources not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error during migration",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during migration",
      },
      conflict: {
        title: "Conflict",
        description: "Migration conflict detected",
      },
      network: {
        title: "Network Error",
        description: "Network error during migration operation",
      },
    },
    success: {
      title: "Migration Successful",
      description: "Database migration completed successfully",
    },
  },
  fields: {
    generate: {
      title: "Generate Migrations",
      description: "Generate new migration files from schema changes",
    },
    redo: {
      title: "Redo Last Migration",
      description: "Roll back and re-apply the last migration",
    },
    schema: {
      title: "Database Schema",
      description: "Target database schema (default: public)",
    },
    dryRun: {
      title: "Dry Run",
      description: "Preview migrations without applying them",
    },
    success: {
      title: "Success Status",
    },
    migrationsRun: {
      title: "Migrations Run",
    },
    migrationsGenerated: {
      title: "Migrations Generated",
    },
    output: {
      title: "Output",
    },
    duration: {
      title: "Duration (ms)",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid migration parameters",
    },
    internal: {
      title: "Internal Error",
      description: "Migration operation failed",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required for migration operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Insufficient permissions for migration operations",
    },
    notFound: {
      title: "Not Found",
      description: "Migration resources not found",
    },
    server: {
      title: "Server Error",
      description: "Internal server error during migration",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during migration",
    },
    conflict: {
      title: "Conflict",
      description: "Migration conflict detected",
    },
    generationFailed: "Failed to generate migrations: {{message}}",
    generationFailedWithCode:
      "Migration generation failed with code {{code}}: {{output}}",
    migrationFailed: "Failed to run migrations: {{message}}",
  },
  success: {
    title: "Migration Successful",
    description: "Database migration completed successfully",
  },
  status: {
    pending: "Pending",
    running: "Running",
    success: "Success",
    failed: "Failed",
    rolledBack: "Rolled Back",
  },
  direction: {
    up: "Up",
    down: "Down",
  },
  environment: {
    development: "Development",
    staging: "Staging",
    production: "Production",
  },
  taskManagement: taskManagementTranslations,
  messages: {
    dryRun: "DRY RUN: Would run migrations",
    generatingMigrations: "Migration Generation:\n{{output}}\n",
    noMigrationsFolder: "No migrations folder found",
    noMigrationFiles: "No migration files found",
    executedMigrations: "Executed {{count}} migrations successfully",
    redoNotImplemented: "Redo functionality would be implemented here",
    repairCompleted: "Migration repair completed successfully",
    repairDryRun: "Dry run: Migration repair would be performed",
    trackingReset: "Migration tracking reset successfully",
    productionCompleted: "Production migrations completed successfully",
    productionWithBackup: " (with backup)",
    syncCompleted: "Migration sync completed successfully ({{direction}})",
    failedToGenerate: "Failed to generate migrations: {{error}}",
    failedToExecute: "Failed to execute migrations: {{error}}",
    failedToRedo: "Failed to redo migration: {{error}}",
  },
};
