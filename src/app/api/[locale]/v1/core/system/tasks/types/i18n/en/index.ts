export const translations = {
  get: {
    title: "Task Types",
    description: "Get task type definitions and metadata",
    container: {
      title: "Task Types Management",
      description: "Manage and retrieve task type definitions",
    },
    fields: {
      operation: {
        label: "Operation",
        description: "Type of operation to perform",
      },
      category: {
        label: "Category",
        description: "Task category to filter by",
      },
      format: {
        label: "Format",
        description: "Output format for the response",
      },
    },
    operation: {
      list: "List Types",
      validate: "Validate Types",
      export: "Export Types",
    },
    category: {
      cron: "Cron Tasks",
      side: "Side Tasks",
      config: "Configuration",
      execution: "Execution",
    },
    format: {
      json: "JSON",
      typescript: "TypeScript",
      schema: "Schema",
    },
    response: {
      success: {
        title: "Success",
      },
      types: {
        title: "Types",
      },
      metadata: {
        title: "Metadata",
      },
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
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
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
      unsaved: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
