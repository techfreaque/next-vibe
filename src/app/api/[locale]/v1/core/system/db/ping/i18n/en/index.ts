export const translations = {
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
    },
    isAccessible: {
      title: "Database Accessible",
    },
    output: {
      title: "Output Message",
    },
    connectionInfo: {
      title: "Connection Information",
      totalConnections: "Total Connections",
      idleConnections: "Idle Connections",
      waitingClients: "Waiting Clients",
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
};
