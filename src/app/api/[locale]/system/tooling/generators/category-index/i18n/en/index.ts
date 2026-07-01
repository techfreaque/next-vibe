export const translations = {
  category: "Generators",

  post: {
    title: "Generate Category Index",
    description: "Generate the admin category registry from category.ts files",
    container: {
      title: "Category Index Generation",
      description: "Configure category index generation parameters",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path for the generated category registry file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview without writing files",
      },
      duration: { title: "Duration" },
      success: { title: "Success" },
      message: { title: "Message" },
      categoriesFound: { title: "Categories Found" },
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
      description: "Category registry generated successfully",
    },
  },
};
