export const translations = {
  // Main endpoint properties
  title: "TypeScript Type Check",
  description: "Run TypeScript type checking on specified files or directories",
  category: "System Checks",
  tag: "typecheck",

  // Container
  container: {
    title: "TypeScript Type Check Configuration",
    description: "Configure parameters for running TypeScript type checking",
  },

  // Request fields
  fields: {
    path: {
      label: "Path",
      description:
        "File or directory path to check (optional, defaults to current directory)",
      placeholder: "src/components",
    },
    verbose: {
      label: "Verbose",
      description: "Enable detailed output with additional information",
    },
    disableFilter: {
      label: "Disable Filter",
      description: "Disable filtering and show all TypeScript issues",
    },
  },

  // Response fields
  response: {
    issue: {
      title: "TypeScript Issue",
      description: "Individual TypeScript type checking issue",
      file: "File path where the issue was found",
      line: "Line number of the issue",
      column: "Column number of the issue",
      code: "TypeScript error code",
      message: "Issue description message",
    },
  },

  // Error messages
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid request parameters provided",
    },
    internal: {
      title: "Internal Error",
      description: "An internal server error occurred during type checking",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required to access this endpoint",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to this endpoint is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The specified resource was not found",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "There are unsaved changes that need to be handled",
    },
    conflict: {
      title: "Conflict",
      description: "A data conflict occurred",
    },
  },

  // Success messages
  success: {
    title: "Type Check Complete",
    description: "TypeScript type checking completed successfully",
  },
};
