export const translations = {
  title: "Stop Performance Trace",
  description:
    "Stops the active performance trace recording on the selected page and returns performance metrics",
  form: {
    label: "Stop Performance Trace",
    description: "Stop the active performance trace recording",
    fields: {},
  },
  response: {
    success: "Performance trace stopped successfully",
    result: "Performance trace stop result with metrics",
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
      description:
        "A network error occurred while stopping the performance trace",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to stop performance traces",
    },
    forbidden: {
      title: "Forbidden",
      description: "Stopping performance traces is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while stopping the performance trace",
    },
    unknown: {
      title: "Unknown Error",
      description:
        "An unknown error occurred while stopping the performance trace",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while stopping the performance trace",
    },
  },
  success: {
    title: "Performance Trace Stopped Successfully",
    description: "The performance trace was stopped successfully",
  },
};
