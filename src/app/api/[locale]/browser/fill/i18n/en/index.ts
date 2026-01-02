/**
 * Fill Tool translations (English)
 */

export const translations = {
  title: "Fill",
  description: "Type text into an input, text area or select an option from a select element",

  form: {
    label: "Fill Element",
    description: "Type text into a form element",
    fields: {
      uid: {
        label: "Element UID",
        description: "The uid of an element on the page from the page content snapshot",
        placeholder: "Enter element uid",
      },
      value: {
        label: "Value",
        description: "The value to fill in",
        placeholder: "Enter value to fill",
      },
    },
  },

  response: {
    success: "Fill operation successful",
    result: "Fill operation result",
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
      description: "A network error occurred during the fill operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform fill operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Fill operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during the fill operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the fill operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the fill operation",
    },
  },

  success: {
    title: "Fill Operation Successful",
    description: "The element was filled successfully",
  },
};
