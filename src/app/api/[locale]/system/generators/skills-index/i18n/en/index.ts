export const translations = {
  category: "Generators",

  post: {
    title: "Generate Skills Index",
    description: "Generate the default skills index file",
    container: {
      title: "Skills Index Generation",
      description: "Configure skills index generation parameters",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path for the generated skills index file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview without writing files",
      },
      duration: { title: "Duration" },
      success: { title: "Success" },
      message: { title: "Message" },
      skillsFound: { title: "Skills Found" },
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
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      notFound: { title: "Not Found", description: "Resource not found" },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
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
