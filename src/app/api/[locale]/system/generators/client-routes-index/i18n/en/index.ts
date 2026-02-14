export const translations = {
  post: {
    title: "Generate Client Routes Index",
    description: "Automatically generate the client routes index file",
    container: {
      title: "Client Routes Index Generator",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to the output file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without writing to file",
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
        title: "Invalid Input",
        description: "Please check your configuration and try again",
      },
      network: {
        title: "Connection Error",
        description: "Unable to generate the index. Please try again",
      },
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to use this generator",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to use this generator",
      },
      notFound: {
        title: "Routes Not Found",
        description: "Unable to find the routes to generate",
      },
      server: {
        title: "Generation Failed",
        description: "We couldn't generate the index. Please try again",
      },
      unknown: {
        title: "Unexpected Error",
        description: "Something unexpected happened. Please try again",
      },
      conflict: {
        title: "File Conflict",
        description: "The index file has conflicts. Please resolve them first",
      },
    },
    success: {
      title: "Index Generated",
      description: "Client routes index has been generated successfully",
    },
  },
};
