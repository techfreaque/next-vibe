export const translations = {
  post: {
    title: "Database Migration Repair",
    description:
      "Repair migration tracking to ensure proper state for production builds",
    form: {
      title: "Migration Repair Options",
      description: "Configure migration repair operation settings",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided migration repair parameters are invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the database for migration repair",
      },
      unauthorized: {
        title: "Unauthorized",
        description:
          "You are not authorized to perform migration repair operations",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "Migration repair operations are not allowed for your role",
      },
      notFound: {
        title: "Not Found",
        description: "The requested migration repair resource was not found",
      },
      server: {
        title: "Server Error",
        description:
          "An internal server error occurred during migration repair",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred during migration repair",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during migration repair operation",
      },
    },
    success: {
      title: "Migration Repair Successful",
      description: "Migration tracking has been successfully repaired",
    },
  },
  fields: {
    force: {
      title: "Force Operation",
      description: "Force repair without confirmation prompts",
    },
    dryRun: {
      title: "Dry Run",
      description: "Show what would be done without actually executing changes",
    },
    reset: {
      title: "Reset Tracking",
      description: "Reset migration tracking (clear all tracked migrations)",
    },
    success: {
      title: "Success",
    },
    output: {
      title: "Output",
    },
    hasTable: {
      title: "Has Migration Table",
    },
    schema: {
      title: "Schema",
    },
    tableName: {
      title: "Table Name",
    },
    trackedMigrations: {
      title: "Tracked Migrations",
    },
    migrationFiles: {
      title: "Migration Files",
    },
    repaired: {
      title: "Repaired Count",
    },
  },
  messages: {
    upToDate: "✅ Migration tracking is up to date - no repair needed",
    dryRunComplete: "✅ Dry run completed - no changes made",
    repairComplete:
      "✅ Migration repair completed successfully! Marked {{count}} migrations as applied",
    success:
      "✅ Migration repair completed successfully! 🚀 Ready for production builds",
  },
  tag: "Database",
};
