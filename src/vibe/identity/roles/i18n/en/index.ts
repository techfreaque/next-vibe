export const translations = {
  errors: {
    find_failed: "Failed to find roles for user {{userId}}: {{error}}",
    batch_find_failed:
      "Failed to batch find roles for {{count}} users: {{error}}",
    not_found: "Role {{role}} not found for user {{userId}}",
    lookup_failed:
      "Failed to look up role {{role}} for user {{userId}}: {{error}}",
    add_failed: "Failed to add role {{role}} to user {{userId}}: {{error}}",
    no_data_returned: "No data returned from database",
    remove_failed:
      "Failed to remove role {{role}} from user {{userId}}: {{error}}",
    check_failed:
      "Failed to check role {{role}} for user {{userId}}: {{error}}",
    delete_failed: "Failed to delete roles for user {{userId}}: {{error}}",
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
      mcpOff: "MCP Disabled",
      mcpVisible: "MCP Visible",
      productionOff: "Production Disabled",
      skillOff: "Skill Disabled",
    },
  },
};
