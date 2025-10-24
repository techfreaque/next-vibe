export const translations = {
  category: "Guard",
  post: {
    title: "Guard Status",
    description: "Check guard environment status",
    tag: "Status",
    container: {
      title: "Guard Status Configuration",
      description: "Configure status check parameters",
    },
    fields: {
      projectPath: {
        title: "Project Path",
        description: "Path to the guard project",
        placeholder: "/path/to/project",
      },
      guardId: {
        title: "Guard ID",
        description: "Unique identifier for the guard",
        placeholder: "guard-123",
      },
      listAll: {
        title: "List All Guards",
        description: "List all guard environments",
      },
      success: {
        title: "Success",
      },
      output: {
        title: "Output",
      },
      guards: {
        title: "Guards",
      },
      totalGuards: {
        title: "Total Guards",
      },
      activeGuards: {
        title: "Active Guards",
      },
    },
    form: {
      title: "Status Configuration",
      description: "Configure status parameters",
    },
    response: {
      title: "Response",
      description: "Status response data",
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
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
