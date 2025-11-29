export const translations = {
  post: {
    title: "Generate All",
    description: "Run all code generators",
    container: {
      title: "Generate All Configuration",
      description: "Configure generation parameters",
    },
    fields: {
      rootDir: {
        label: "Root Directory",
        description: "Root directory for generation",
      },
      outputDir: {
        label: "Output Directory",
        description: "Output directory for generated files",
      },
      verbose: {
        label: "Verbose Output",
        description: "Enable verbose logging",
      },
      skipEndpoints: {
        label: "Skip Endpoints",
        description: "Skip endpoint generation",
      },
      skipSeeds: {
        label: "Skip Seeds",
        description: "Skip seed generation",
      },
      skipTaskIndex: {
        label: "Skip Task Index",
        description: "Skip task index generation",
      },
      skipTrpc: {
        label: "Skip TRPC",
        description: "Skip TRPC router generation",
      },
      success: {
        title: "Success",
      },
      generationCompleted: {
        title: "Generation Completed",
      },
      output: {
        title: "Output",
      },
      generationStats: {
        title: "Generation Statistics",
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
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
