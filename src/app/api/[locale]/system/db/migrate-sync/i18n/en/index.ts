export const translations = {
  post: {
    title: "Database Migration Sync",
    description:
      "Synchronize migration state by letting Drizzle handle tracking properly while avoiding conflicts",
    form: {
      title: "Migration Sync Options",
      description: "Configure migration synchronization operation settings",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided migration sync parameters are invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the database for migration sync",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform migration sync operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Migration sync operations are not allowed for your role",
      },
      notFound: {
        title: "Not Found",
        description: "The requested migration sync resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred during migration sync",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred during migration sync",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during migration sync operation",
      },
    },
    success: {
      title: "Migration Sync Successful",
      description: "Migration state has been successfully synchronized",
    },
  },
  fields: {
    force: {
      title: "Force Operation",
      description: "Force sync without confirmation prompts",
    },
    dryRun: {
      title: "Dry Run",
      description: "Show what would be done without actually executing changes",
    },
    success: {
      title: "Success",
    },
    output: {
      title: "Output",
    },
    trackingCleared: {
      title: "Tracking Cleared",
    },
    trackingFilesCreated: {
      title: "Tracking Files Created",
    },
    drizzleMigrationRun: {
      title: "Drizzle Migration Run",
    },
    originalFilesRestored: {
      title: "Original Files Restored",
    },
    migrationsProcessed: {
      title: "Migrations Processed",
    },
  },
  messages: {
    dryRunComplete: "✅ Dry run completed - no changes made",
    success:
      "✅ Migration sync completed successfully! 🚀 Migrations are now properly tracked by Drizzle",
  },
  tag: "Database",
};
