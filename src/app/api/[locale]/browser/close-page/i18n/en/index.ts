/**
 * Close Page Tool translations (English)
 */

export const translations = {
  title: "Close Page",
  description:
    "Closes the page by its index. The last open page cannot be closed",

  form: {
    label: "Close Page",
    description: "Close a browser page by its index",
    fields: {
      pageIdx: {
        label: "Page Index",
        description:
          "The index of the page to close. Call list_pages to list pages",
        placeholder: "Enter page index (e.g., 0)",
      },
    },
  },

  response: {
    success: "Page closed successfully",
    result: "Close page operation result",
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
      description: "A network error occurred while closing the page",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to close pages",
    },
    forbidden: {
      title: "Forbidden",
      description: "Page close operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested page was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while closing the page",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while closing the page",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while closing the page",
    },
  },

  success: {
    title: "Page Closed Successfully",
    description: "The page was closed successfully",
  },
};
