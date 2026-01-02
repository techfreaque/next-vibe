export const translations = {
  post: {
    title: "Production Database Migration",
    description: "Run production database migrations with safety checks for CI/CD pipelines",
    form: {
      title: "Production Migration Options",
      description: "Configure production migration operation settings",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided production migration parameters are invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the database for production migration",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform production migration operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Production migration operations are not allowed for your role",
      },
      notFound: {
        title: "Not Found",
        description: "The requested production migration resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred during production migration",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred during production migration",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during production migration operation",
      },
    },
    success: {
      title: "Production Migration Successful",
      description: "Production migration has been completed successfully",
    },
  },
  fields: {
    skipSeeding: {
      title: "Skip Seeding",
      description: "Skip running production seeding after migrations",
    },
    force: {
      title: "Force Operation",
      description: "Force operations without confirmation prompts",
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
    environment: {
      title: "Environment",
    },
    databaseUrl: {
      title: "Database URL",
    },
    migrationsGenerated: {
      title: "Migrations Generated",
    },
    migrationsApplied: {
      title: "Migrations Applied",
    },
    seedingCompleted: {
      title: "Seeding Completed",
    },
  },
  messages: {
    dryRunComplete: "✅ Dry run completed - no changes made",
    successWithSeeding: "✅ Production migration completed successfully! 🚀 Ready for deployment",
    successWithoutSeeding:
      "✅ Production migration completed successfully (seeding skipped)! 🚀 Ready for deployment",
  },
  errors: {
    notProduction: "❌ NODE_ENV is not set to 'production'. Use --force to override.",
    noDatabaseUrl: "❌ DATABASE_URL environment variable is required",
    localhostDatabase: "❌ DATABASE_URL appears to be localhost. Use --force to override.",
  },
  tag: "Database",
};
