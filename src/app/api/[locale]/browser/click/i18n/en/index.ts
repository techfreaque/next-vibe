/**
 * Click Tool translations (English)
 */

export const translations = {
  title: "Click Element",
  description: "Clicks on the provided element",

  form: {
    label: "Click Element",
    description: "Click on a specific element on the page",
    fields: {
      uid: {
        label: "Element UID",
        description: "The uid of an element on the page from the page content snapshot",
        placeholder: "Enter element UID",
      },
      dblClick: {
        label: "Double Click",
        description: "Set to true for double clicks. Default is false",
      },
    },
  },

  response: {
    success: "Click operation successful",
    result: "Click operation result",
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
      description: "A network error occurred during the click operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform click operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Click operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested element was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during the click operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the click operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the click operation",
    },
  },

  success: {
    title: "Click Operation Successful",
    description: "The element was clicked successfully",
  },
};
