export const translations = {
  post: {
    title: "Environment Generator",
    description: "Generate consolidated environment configuration files",
    form: {
      title: "Environment Configuration",
      description: "Configure environment generation parameters",
    },
    fields: {
      outputDir: {
        label: "Output Directory",
        description: "Directory to write generated files",
      },
      verbose: {
        label: "Verbose",
        description: "Show detailed output",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview without writing files",
      },
      success: {
        label: "Success",
      },
      message: {
        label: "Message",
      },
      serverEnvFiles: {
        label: "Server Env Files",
      },
      clientEnvFiles: {
        label: "Client Env Files",
      },
      duration: {
        label: "Duration",
      },
      outputPaths: {
        label: "Output Paths",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid env file exports detected",
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Environment files generated successfully",
    },
  },
  tags: {
    env: "environment",
  },
  error: {
    validation_failed: "Env file validation failed",
    generation_failed: "Env generation failed",
    noValidFiles: "No valid environment files found",
  },
  success: {
    generated: "Environment files generated successfully",
  },
};
