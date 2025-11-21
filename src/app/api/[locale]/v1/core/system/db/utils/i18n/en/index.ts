import { translations as dockerOperationsTranslations } from "../../docker-operations/i18n/en";

export const translations = {
  dockerOperations: dockerOperationsTranslations,
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
};
