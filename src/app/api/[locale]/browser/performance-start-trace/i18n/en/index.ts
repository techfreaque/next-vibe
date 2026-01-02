export const translations = {
  title: "Start Performance Trace",
  description:
    "Starts a performance trace recording on the selected page to analyze performance metrics and core web vitals",
  form: {
    label: "Start Performance Trace",
    description: "Begin recording performance metrics for the browser page",
    fields: {
      reload: {
        label: "Reload Page",
        description:
          "Determines if, once tracing has started, the page should be automatically reloaded",
        placeholder: "true",
      },
      autoStop: {
        label: "Auto Stop",
        description: "Determines if the trace recording should be automatically stopped",
        placeholder: "true",
      },
    },
  },
  response: {
    success: "Performance trace started successfully",
    result: "Performance trace start result",
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
      description: "A network error occurred while starting the performance trace",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to start performance traces",
    },
    forbidden: {
      title: "Forbidden",
      description: "Starting performance traces is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while starting the performance trace",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while starting the performance trace",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while starting the performance trace",
    },
  },
  success: {
    title: "Performance Trace Started Successfully",
    description: "The performance trace was started successfully",
  },
};
