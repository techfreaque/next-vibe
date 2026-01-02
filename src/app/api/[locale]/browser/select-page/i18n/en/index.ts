export const translations = {
  title: "Select Page",
  description: "Select a page as a context for future tool calls",
  form: {
    label: "Select Page",
    description: "Select a page by its index",
    fields: {
      pageIdx: {
        label: "Page Index",
        description: "The index of the page to select (call list_pages to list pages)",
        placeholder: "Enter page index",
      },
    },
  },
  response: {
    success: "Page selection operation successful",
    result: "Result of page selection",
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
      description: "A network error occurred while selecting the page",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to select pages",
    },
    forbidden: {
      title: "Forbidden",
      description: "Page selection operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while selecting the page",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while selecting the page",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while selecting the page",
    },
  },
  success: {
    title: "Page Selected Successfully",
    description: "The page was selected successfully",
  },
};
