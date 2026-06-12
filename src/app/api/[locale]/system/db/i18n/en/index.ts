export const translations = {
  category: "Database Operations",
  generate: {
    category: "Database Operations",
    tag: "migration",
    post: {
      title: "Generate Migrations",
      description: "Generate Drizzle migration files from schema changes",
      form: {
        title: "Generate Configuration",
        description: "Configure migration generation options",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid parameters",
        },
        network: {
          title: "Generation Failed",
          description: "drizzle-kit generate failed",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Insufficient permissions",
        },
        notFound: { title: "Not Found", description: "Resources not found" },
        server: { title: "Server Error", description: "Internal server error" },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        conflict: { title: "Conflict", description: "Conflict detected" },
      },
      success: {
        title: "Generation Successful",
        description: "Migration files generated successfully",
      },
    },
    fields: {
      success: { title: "Success Status" },
      output: { title: "Output" },
      duration: { title: "Duration (ms)" },
    },
  },
  migrate: {
    category: "Database Operations",

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
  },
  ping: {
    category: "Database Operations",
    tag: "database",
    post: {
      title: "Database Ping",
      description: "Check database connectivity and health",
      form: {
        title: "Ping Configuration",
        description: "Configure database ping parameters",
      },
      response: {
        title: "Response",
        description: "Ping response data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to access database operations",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid ping request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred while pinging database",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during database ping",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while connecting to database",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden - insufficient permissions",
        },
        notFound: {
          title: "Not Found",
          description: "Database resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred during operation",
        },
      },
      success: {
        title: "Database Ping Successful",
        description: "Successfully connected to database",
      },
    },
    fields: {
      silent: {
        title: "Silent Mode",
        description: "Run ping without output messages",
      },
      keepConnectionOpen: {
        title: "Keep Connection Open",
        description: "Keep database connection open after ping",
      },
      success: {
        title: "Success Status",
        content: "Success",
      },
      isAccessible: {
        title: "Database Accessible",
        content: "Accessible",
      },
      output: {
        title: "Output Message",
        content: "Output",
      },
      connectionInfo: {
        title: "Connection Information",
        totalConnections: {
          content: "Total Connections",
        },
        idleConnections: {
          content: "Idle Connections",
        },
        waitingClients: {
          content: "Waiting Clients",
        },
      },
    },
    status: {
      success: "Success",
      failed: "Failed",
      timeout: "Timeout",
      error: "Error",
    },
    connectionType: {
      primary: "Primary",
      replica: "Replica",
      cache: "Cache",
    },
  },
  seed: {
    category: "Database Operations",

    tag: "seed",
    post: {
      title: "Database Seed",
      description: "Seed database with data",
      form: {
        title: "Seed Configuration",
        description: "Configure seeding parameters",
      },
      response: {
        title: "Seed Response",
        description: "Results of database seeding operation",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for database seeding",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid seed parameters provided",
        },
        server: {
          title: "Server Error",
          description: "Internal server error during seeding",
        },
        internal: {
          title: "Internal Error",
          description: "Database seeding operation failed",
        },
        database: {
          title: "Database Error",
          description: "Database error occurred during seeding",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during seeding",
        },
        network: {
          title: "Network Error",
          description: "Network error during seeding",
        },
        forbidden: {
          title: "Forbidden",
          description: "Insufficient permissions for database seeding",
        },
        notFound: {
          title: "Not Found",
          description: "Seed resources not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict detected during seeding",
        },
      },
      success: {
        title: "Database Seeded",
        description: "Database seeding completed successfully",
      },
    },
    fields: {
      environment: {
        title: "Environment",
        description: "Target seed environment (dev, test, prod)",
      },
      success: {
        title: "Success Status",
      },
      seedsExecuted: {
        title: "Seeds Executed",
      },
      collections: {
        title: "Seed Collections",
        item: {
          title: "Collection",
        },
        name: {
          title: "Collection Name",
        },
        status: {
          title: "Status",
        },
        recordsCreated: {
          title: "Records Created",
        },
      },
      totalRecords: {
        title: "Total Records",
      },
      duration: {
        title: "Duration (ms)",
      },
    },
  },
  sql: {
    category: "Database Operations",

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
      queryFile: {
        title: "Query File Path",
        description: "Path to a SQL file to execute",
        placeholder: "/path/to/query.sql",
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
  },
  studio: {
    category: "Database Operations",

    tag: "studio",
    post: {
      title: "Database Studio",
      description: "Open database studio for visual database management",
      form: {
        title: "Studio Configuration",
        description: "Configure database studio parameters",
      },
      response: {
        title: "Studio Response",
        description: "Database studio launch results",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for database studio",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid studio parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error during studio launch",
        },
        internal: {
          title: "Internal Error",
          description: "Database studio launch failed",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred during studio launch",
        },
        network: {
          title: "Network Error",
          description: "Network error during studio launch",
        },
        forbidden: {
          title: "Forbidden",
          description: "Insufficient permissions for database studio",
        },
        notFound: {
          title: "Not Found",
          description: "Studio resources not found",
        },
        conflict: {
          title: "Conflict",
          description: "Studio port conflict detected",
        },
      },
      success: {
        title: "Studio Launched",
        description: "Database studio launched successfully",
      },
    },
    fields: {
      port: {
        title: "Port",
        description: "Port number for database studio (1024-65535)",
      },
      openBrowser: {
        title: "Open Browser",
        description: "Automatically open studio in browser",
      },
      success: {
        title: "Success Status",
      },
      url: {
        title: "Studio URL",
      },
      portUsed: {
        title: "Actual Port Used",
      },
      output: {
        title: "Launch Output",
      },
      duration: {
        title: "Launch Duration",
      },
    },
  },
  utils: {
    category: "Database Operations",

    dockerOperations: {
      title: "Docker Operations",
      description: "Execute Docker commands and manage containers",
      category: "Docker",
      tags: {
        docker: "Docker",
        utils: "Utilities",
        dockeroperations: "Docker Operations",
      },
      container: {
        title: "Docker Operations",
        description: "Execute Docker commands with proper error handling",
      },
      fields: {
        command: {
          label: "Docker Command",
          description: "The Docker command to execute",
          placeholder: "docker ps",
        },
        options: {
          label: "Execution Options",
          description: "Configuration options for command execution",
          placeholder: "Configure timeout and logging options",
        },
      },
      response: {
        success: {
          label: "Command Success",
        },
        output: {
          label: "Command Output",
        },
        error: {
          label: "Error Details",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid Docker command parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for Docker operations",
        },
        forbidden: {
          title: "Forbidden",
          description: "Insufficient permissions for Docker operations",
        },
        internal: {
          title: "Docker Error",
          description: "Docker command execution failed",
        },
        timeout: {
          title: "Command Timeout",
          description: "Docker command exceeded timeout limit",
        },
        executionFailed: {
          title: "Execution Failed",
          description: "Docker command execution failed",
        },
        composeDownFailed: {
          title: "Compose Down Failed",
          description: "Docker Compose down operation failed",
        },
        composeUpFailed: {
          title: "Compose Up Failed",
          description: "Docker Compose up operation failed",
        },
      },
      success: {
        title: "Docker Command Successful",
        description: "Docker command executed successfully",
      },
      messages: {
        executingCommand: "Executing Docker command: {command}",
        timeoutError: "Docker command timed out after {timeout}ms: {command}",
        commandFailed: "Docker command failed with code {code}: {command}",
        executionFailed: "Failed to execute Docker command: {command}",
        commandError: "Docker command error: {error}",
      },
    },
    title: "Database Utils",
    description: "Utility functions for database operations",
    tag: "utils",
    includeDetails: {
      title: "Include Details",
      description: "Include detailed information in the response",
    },
    checkConnections: {
      title: "Check Connections",
      description: "Check database connection status",
    },
    status: {
      title: "Health Status",
    },
    timestamp: {
      title: "Timestamp",
    },
    connections: {
      title: "Connection Status",
      primary: "Primary Connection",
      replica: "Replica Connection",
    },
    details: {
      title: "Database Details",
      version: "Version",
      uptime: "Uptime (seconds)",
      activeConnections: "Active Connections",
      maxConnections: "Max Connections",
    },
    errors: {
      health_check_failed: "Database health check failed",
      connection_failed: "Database connection failed",
      stats_failed: "Failed to retrieve database statistics",
      docker_check_failed: "Docker availability check failed",
      reset_failed: "Database reset operation failed",
      manage_failed: "Database management operation failed",
      reset_operation_failed: "Reset operation failed",
      validation: {
        title: "Validation Error",
        description: "Invalid database utility parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for database utilities",
      },
      internal: {
        title: "Internal Error",
        description: "Database utility operation failed",
      },
    },
    success: {
      title: "Database Utilities Successful",
      description: "Database utility operations completed successfully",
    },
    docker: {
      executing_command: "Executing Docker command: {{command}}",
      command_timeout:
        "Docker command timed out after {{timeout}}ms: {{command}}",
      command_failed: "Docker command failed with code {{code}}: {{command}}",
      execution_failed: "Failed to execute Docker command: {{command}}",
      command_error: "Docker command error: {{error}}",
      stopping_containers: "Stopping Docker containers...",
      starting_containers: "Starting Docker containers...",
    },
  },
};
