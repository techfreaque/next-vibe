export const translations = {
  category: "Database Operations",

  tag: "schema-verify",
  post: {
    title: "Schema Verify",
    description: "Verify database schema integrity and optionally fix issues",
    form: {
      title: "Schema Verify Configuration",
      description: "Configure schema verification parameters",
    },
    response: {
      title: "Schema Verify Response",
      description: "Results from the schema verification",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for schema verification",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid schema verification parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error during schema verification",
      },
      internal: {
        title: "Internal Error",
        description: "Schema verification operation failed",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during schema verification",
      },
      network: {
        title: "Network Error",
        description: "Network error during schema verification",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions for schema verification",
      },
      notFound: {
        title: "Not Found",
        description: "Schema verification resources not found",
      },
      conflict: {
        title: "Conflict",
        description: "Schema verification conflict detected",
      },
    },
    success: {
      title: "Schema Verified",
      description: "Database schema verification completed successfully",
    },
  },
  fields: {
    fixIssues: {
      title: "Fix Issues",
      description: "Automatically fix detected schema issues",
    },
    silent: {
      title: "Silent Mode",
      description: "Suppress output messages",
    },
    success: {
      title: "Success Status",
    },
    valid: {
      title: "Schema Valid",
    },
    output: {
      title: "Output",
    },
    issues: {
      title: "Issues Found",
    },
    fixedIssues: {
      title: "Fixed Issues",
    },
  },
  verified: {
    tables: "✅ Verified {{count}} tables",
    columns: "✅ Verified {{count}} columns",
    indexes: "✅ Verified {{count}} indexes",
    constraints: "✅ Verified {{count}} constraints",
  },
  fixed: "🔧 Fixed {{count}} schema issues",
  validationPassed: "\n✅ Schema validation passed - all checks successful",
  validationFailed: "\n❌ Schema validation failed - {{count}} issues found",
  dbConnectionFailed: "Failed to connect to database",
};
