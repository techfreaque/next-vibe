export const translations = {
  title: "Analyze Performance Insight",
  description: "Provides more detailed information on a specific Performance Insight of an insight set that was highlighted in the results of a trace recording",
  form: {
    label: "Analyze Performance Insight",
    description: "Get detailed information about a specific performance insight",
    fields: {
      insightSetId: {
        label: "Insight Set ID",
        description: "The id for the specific insight set (only use the ids given in the Available insight sets list)",
        placeholder: "Enter insight set ID",
      },
      insightName: {
        label: "Insight Name",
        description: "The name of the Insight you want more information on (e.g., DocumentLatency or LCPBreakdown)",
        placeholder: "Enter insight name",
      },
    },
  },
  response: {
    success: "Performance insight analyzed successfully",
    result: "Performance insight analysis result",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: { title: "Validation Error", description: "Please check your input and try again" },
    network: { title: "Network Error", description: "A network error occurred while analyzing the performance insight" },
    unauthorized: { title: "Unauthorized", description: "You are not authorized to analyze performance insights" },
    forbidden: { title: "Forbidden", description: "Analyzing performance insights is forbidden" },
    notFound: { title: "Not Found", description: "The requested resource was not found" },
    serverError: { title: "Server Error", description: "An internal server error occurred while analyzing the performance insight" },
    unknown: { title: "Unknown Error", description: "An unknown error occurred while analyzing the performance insight" },
    unsavedChanges: { title: "Unsaved Changes", description: "You have unsaved changes that may be lost" },
    conflict: { title: "Conflict", description: "A conflict occurred while analyzing the performance insight" },
  },
  success: {
    title: "Performance Insight Analyzed Successfully",
    description: "The performance insight was analyzed successfully",
  },
};
