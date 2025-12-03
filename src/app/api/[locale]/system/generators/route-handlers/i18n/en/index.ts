export const translations = {
  post: {
    title: "Route Handlers Generator",
    description: "Generate route-handlers.ts with dynamic imports",
    container: {
      title: "Route Handlers Generator Configuration",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to the output route-handlers.ts file",
        title: "Output File",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without writing files",
        title: "Dry Run",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Message",
      },
      routesFound: {
        title: "Routes Found",
      },
      duration: {
        title: "Duration (ms)",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Route handlers generator completed successfully",
      generated: "Route handlers file generated successfully",
    },
  },
};
