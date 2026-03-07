export const translations = {
  category: "Generators",

  post: {
    title: "Generate Endpoints Meta",
    description:
      "Generate localized endpoint metadata files for the tools modal",
    container: {
      title: "Endpoints Meta Configuration",
    },
    fields: {
      outputDir: {
        label: "Output Directory",
        description: "Directory to write per-locale metadata files",
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
      description: "Endpoints meta generated successfully",
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
    generated: "Endpoints meta generated successfully",
  },
};
