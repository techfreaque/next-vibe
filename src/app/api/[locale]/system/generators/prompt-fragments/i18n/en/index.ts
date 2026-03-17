export const translations = {
  category: "Generators",

  post: {
    title: "Generate Prompt Fragments",
    description: "Generate prompt fragments index with dynamic imports",
    container: {
      title: "Prompt Fragments Generation",
      description: "Configure prompt fragments index generation",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path for the generated prompt-fragments.ts file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview without writing files",
      },
      fragmentsFound: {
        title: "Fragments Found",
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
