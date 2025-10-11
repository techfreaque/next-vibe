export const translations = {
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
      cliOnly: "CLI Only",
      cliWeb: "CLI Web",
      webOnly: "Web Only",
    },
  },
};
