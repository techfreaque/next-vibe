export const translations = {
  post: {
    title: "Endpoint Generator",
    description: "Generate endpoint.ts with dynamic imports",
    container: {
      title: "Endpoint Generator Configuration",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to the output endpoint.ts file",
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
      endpointsFound: {
        title: "Endpoints Found",
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
      description: "Endpoint generator completed successfully",
      generated: "Endpoint file generated successfully",
    },
  },
};
