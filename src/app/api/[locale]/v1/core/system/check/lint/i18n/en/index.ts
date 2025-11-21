export const translations = {
  title: "Lint",
  description: "Run ESLint on your codebase",
  category: "System Checks",
  tag: "Lint",
  status: {
    passed: "Passed",
    failed: "Failed",
    running: "Running",
    skipped: "Skipped",
  },
  severity: {
    error: "Error",
    warning: "Warning",
    info: "Info",
  },
  fixAction: {
    autoFix: "Auto Fix",
    manualFix: "Manual Fix",
    ignore: "Ignore",
  },
  container: {
    title: "Lint Configuration",
    description: "Configure lint parameters",
  },
  fields: {
    path: {
      label: "Path",
      description: "Path to lint",
      placeholder: "Enter path to lint",
    },
    verbose: {
      label: "Verbose",
      description: "Enable verbose output",
    },
    fix: {
      label: "Auto Fix",
      description: "Automatically fix issues",
    },
    timeoutSeconds: {
      label: "Timeout (seconds)",
      description: "Maximum execution time",
    },
    cacheDir: {
      label: "Cache Directory",
      description: "Directory for cache files",
    },
  },
  response: {
    success: "Lint completed successfully",
    errors: {
      item: {
        file: "File",
        line: "Line",
        column: "Column",
        rule: "Rule",
        severity: "Severity",
        message: "Message",
        title: "Lint Issue",
        type: "Type",
      },
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    internal: {
      title: "Internal Error",
      description: "An internal error occurred",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
  },
  success: {
    title: "Success",
    description: "Lint completed successfully",
  },
  post: {
    title: "Lint",
    description: "Run ESLint on your codebase",
    form: {
      title: "Lint Configuration",
      description: "Configure lint parameters",
    },
    response: {
      title: "Response",
      description: "Lint response data",
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
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
