export const translations = {
  post: {
    title: "Generate Endpoints Index",
    description: "Generate endpoints index file",
    container: {
      title: "Endpoints Index Configuration",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to output file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without writing",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Message",
      },
      duration: {
        title: "Duration",
      },
      endpointsFound: {
        title: "Endpoints Found",
      },
    },
    success: {
      title: "Success",
      description: "Endpoints index generated successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      server: {
        title: "Server Error",
        description: "Internal server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict",
      },
    },
  },
};
