/**
 * Fill Form Tool translations (English)
 */

export const translations = {
  title: "Fill Form",
  description: "Fill out multiple form elements at once",

  form: {
    label: "Fill Form Elements",
    description: "Fill multiple form elements simultaneously",
    fields: {
      elements: {
        label: "Form Elements",
        description: "Array of elements from snapshot to fill out",
        placeholder: "Enter form elements (JSON array)",
      },
    },
  },

  response: {
    success: "Form fill operation successful",
    result: "Form fill operation result",
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
      description: "A network error occurred during the form fill operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform form fill operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Form fill operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred during the form fill operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the form fill operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the form fill operation",
    },
  },

  success: {
    title: "Form Fill Operation Successful",
    description: "All form elements were filled successfully",
  },
};
