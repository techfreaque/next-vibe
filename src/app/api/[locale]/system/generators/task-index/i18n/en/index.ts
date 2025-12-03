export const translations = {
  post: {
    title: "Generate Task Index",
    description: "Generate task index files",
    container: {
      title: "Task Index Generation",
      description: "Configure task index generation parameters",
    },
    fields: {
      outputDir: {
        label: "Output Directory",
        description: "Directory for generated task index files",
      },
      verbose: {
        label: "Verbose Output",
        description: "Enable verbose logging",
      },
      duration: {
        title: "Duration",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Message",
      },
      tasksFound: {
        title: "Tasks Found",
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
