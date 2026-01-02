export const translations = {
  title: "Navigate Page",
  description: "Navigate the currently selected page",
  form: {
    label: "Navigate Page",
    description: "Navigate the currently selected page to a URL or through history",
    fields: {
      type: {
        label: "Navigation Type",
        description: "Navigate by URL, back or forward in history, or reload",
        placeholder: "Select navigation type",
        options: {
          url: "URL",
          back: "Back",
          forward: "Forward",
          reload: "Reload",
        },
      },
      url: {
        label: "URL",
        description: "Target URL (only for type=url)",
        placeholder: "Enter URL",
      },
      ignoreCache: {
        label: "Ignore Cache",
        description: "Whether to ignore cache on reload",
        placeholder: "Ignore cache",
      },
      timeout: {
        label: "Timeout",
        description: "Maximum wait time in milliseconds (0 for default)",
        placeholder: "Enter timeout",
      },
    },
  },
  response: {
    success: "Navigation operation successful",
    result: "Result of the navigation",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred during navigation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to navigate pages",
    },
    forbidden: {
      title: "Forbidden",
      description: "Page navigation operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during navigation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during navigation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during navigation",
    },
  },
  success: {
    title: "Navigation Successful",
    description: "The page was navigated successfully",
  },
};
