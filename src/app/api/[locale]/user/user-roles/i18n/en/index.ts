export const translations = {
  errors: {
    find_failed: "Failed to find user roles",
    batch_find_failed: "Failed to batch find user roles",
    not_found: "User role not found",
    lookup_failed: "Failed to lookup user role",
    add_failed: "Failed to add role to user",
    no_data_returned: "No data returned from database",
    remove_failed: "Failed to remove role from user",
    check_failed: "Failed to check if user has role",
    delete_failed: "Failed to delete user roles",
    endpoint_not_created: "User roles endpoint has not been created yet",
  },
  post: {
    title: "User Roles",
    description: "User Roles endpoint",
    form: {
      title: "User Roles Configuration",
      description: "Configure user roles parameters",
    },
    response: {
      title: "Response",
      description: "User Roles response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      database_connection_failed: {
        title: "Database Connection Failed",
        description: "Failed to connect to database",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Customer",
      partnerAdmin: "Partner Admin",
      partnerEmployee: "Partner Employee",
      admin: "Admin",
      cliOff: "CLI Disabled",
      cliAuthBypass: "CLI Auth Bypass",
      aiToolOff: "AI Tool Disabled",
      webOff: "Web Disabled",
      mcpOn: "MCP Enabled",
      productionOff: "Production Disabled",
    },
  },
};
