export const translations = {
  title: "New Page",
  description: "Create a new page",
  form: {
    label: "New Page",
    description: "Create a new browser page and load a URL",
    fields: {
      url: {
        label: "URL",
        description: "URL to load in the new page",
        placeholder: "Enter URL",
      },
      timeout: {
        label: "Timeout",
        description: "Maximum wait time in milliseconds (0 for default)",
        placeholder: "Enter timeout",
      },
    },
  },
  response: {
    success: "New page creation operation successful",
    result: "Result of new page creation",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: { title: "Validation Error", description: "Please check your input and try again" },
    network: { title: "Network Error", description: "A network error occurred while creating the new page" },
    unauthorized: { title: "Unauthorized", description: "You are not authorized to create new pages" },
    forbidden: { title: "Forbidden", description: "New page creation operation is forbidden" },
    notFound: { title: "Not Found", description: "The requested resource was not found" },
    serverError: { title: "Server Error", description: "An internal server error occurred while creating the new page" },
    unknown: { title: "Unknown Error", description: "An unknown error occurred while creating the new page" },
    unsavedChanges: { title: "Unsaved Changes", description: "You have unsaved changes that may be lost" },
    conflict: { title: "Conflict", description: "A conflict occurred while creating the new page" },
  },
  success: {
    title: "New Page Created Successfully",
    description: "The new page was created successfully",
  },
};
