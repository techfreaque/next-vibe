export const translations = {
  title: "Press Key",
  description: "Press a key or key combination",
  form: {
    label: "Press Key",
    description: "Press a key or key combination",
    fields: {
      key: {
        label: "Key",
        description:
          "A key or a combination (e.g., Enter, Control+A, Control+Shift+R)",
        placeholder: "Enter key or combination",
      },
    },
  },
  response: {
    success: "Key press operation successful",
    result: "Key press operation result",
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
      description: "A network error occurred during the key press operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform key press operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Key press operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred during the key press operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the key press operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the key press operation",
    },
  },
  success: {
    title: "Key Press Operation Successful",
    description: "The key was pressed successfully",
  },
};
