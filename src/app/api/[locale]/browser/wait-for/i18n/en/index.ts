/**
 * Wait For Tool translations (English)
 */

export const translations = {
  title: "Wait For",
  description: "Wait for the specified text to appear on the selected page",

  form: {
    label: "Wait For Text",
    description: "Wait for specific text to appear on the page",
    fields: {
      text: {
        label: "Text",
        description: "Text to appear on the page",
        placeholder: "Enter text to wait for",
      },
      timeout: {
        label: "Timeout",
        description:
          "Maximum wait time in milliseconds. If set to 0, the default timeout will be used",
        placeholder: "Enter timeout (ms)",
      },
    },
  },

  response: {
    success: "Wait operation successful",
    result: "Wait operation result",
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
      description: "A network error occurred during the wait operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform wait operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Wait operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during the wait operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the wait operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the wait operation",
    },
  },

  success: {
    title: "Wait Operation Successful",
    description: "The specified text appeared on the page",
  },
};
