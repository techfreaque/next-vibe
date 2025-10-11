export const translations = {
  tag: "sql",
  post: {
    title: "Execute SQL",
    description: "Execute SQL queries on the database",
    form: {
      title: "SQL Query Configuration",
      description: "Configure SQL query parameters",
    },
    response: {
      title: "Query Response",
      description: "SQL query execution results",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for SQL execution",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid SQL query or parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error during SQL execution",
      },
      internal: {
        title: "Internal Error",
        description: "SQL query execution failed",
      },
      database: {
        title: "Database Error",
        description: "Database error occurred during query execution",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during SQL execution",
      },
      network: {
        title: "Network Error",
        description: "Network error during SQL execution",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions for SQL execution",
      },
      notFound: {
        title: "Not Found",
        description: "SQL resources not found",
      },
      conflict: {
        title: "Conflict",
        description: "SQL conflict detected",
      },
    },
    success: {
      title: "Query Executed",
      description: "SQL query executed successfully",
    },
  },
  fields: {
    query: {
      title: "SQL Query",
      description: "The SQL query to execute",
    },
    dryRun: {
      title: "Dry Run",
      description: "Preview query without executing",
    },
    verbose: {
      title: "Verbose Output",
      description: "Show detailed query information",
    },
    limit: {
      title: "Row Limit",
      description: "Maximum number of rows to return (1-1000)",
    },
    success: {
      title: "Success Status",
    },
    output: {
      title: "Output",
    },
    results: {
      title: "Query Results",
    },
    rowCount: {
      title: "Row Count",
    },
    queryType: {
      title: "Query Type",
    },
  },
};
