export const translations = {
  category: "Generators",

  post: {
    title: "Generate Remote Capabilities",
    description:
      "Generate remote capability snapshot files for cross-instance tool discovery",
    container: {
      title: "Remote Capabilities Configuration",
    },
    fields: {
      outputDir: {
        label: "Output Directory",
        description: "Directory to write per-locale capability files",
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
      filesWritten: {
        title: "Files Written",
      },
    },
    success: {
      title: "Success",
      description: "Remote capabilities generated successfully",
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
  success: {
    generated: "Remote capabilities generated successfully",
  },
};
