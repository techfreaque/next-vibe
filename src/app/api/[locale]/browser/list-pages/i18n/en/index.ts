export const translations = {
  title: "List Pages",
  description: "Get a list of pages open in the browser",
  form: {
    label: "List Pages",
    description: "Get all open browser pages",
    fields: {},
  },
  response: {
    success: "Pages listing operation successful",
    result: "Result of pages listing",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: { title: "Validation Error", description: "Please check your input and try again" },
    network: { title: "Network Error", description: "A network error occurred while listing pages" },
    unauthorized: { title: "Unauthorized", description: "You are not authorized to list pages" },
    forbidden: { title: "Forbidden", description: "Page listing operation is forbidden" },
    notFound: { title: "Not Found", description: "The requested resource was not found" },
    serverError: { title: "Server Error", description: "An internal server error occurred while listing pages" },
    unknown: { title: "Unknown Error", description: "An unknown error occurred while listing pages" },
    unsavedChanges: { title: "Unsaved Changes", description: "You have unsaved changes that may be lost" },
    conflict: { title: "Conflict", description: "A conflict occurred while listing pages" },
  },
  success: {
    title: "Pages Listed Successfully",
    description: "The open pages were listed successfully",
  },
};
