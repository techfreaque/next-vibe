/**
 * Hover Tool translations (English)
 */

export const translations = {
  title: "Hover",
  description: "Hover over the provided element",

  form: {
    label: "Hover Element",
    description: "Move mouse cursor over an element",
    fields: {
      uid: {
        label: "Element UID",
        description:
          "The uid of an element on the page from the page content snapshot",
        placeholder: "Enter element uid",
      },
    },
  },

  response: {
    success: "Hover operation successful",
    result: "Hover operation result",
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
      description: "A network error occurred during the hover operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform hover operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Hover operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred during the hover operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the hover operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the hover operation",
    },
  },

  success: {
    title: "Hover Operation Successful",
    description: "The element was hovered successfully",
  },
};
