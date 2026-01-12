/**
 * Drag Tool translations (English)
 */

export const translations = {
  title: "Drag Element",
  description: "Drag an element onto another element",

  form: {
    label: "Drag Element",
    description: "Drag one element onto another element",
    fields: {
      from_uid: {
        label: "From Element UID",
        description: "The uid of the element to drag",
        placeholder: "Enter source element UID",
      },
      to_uid: {
        label: "To Element UID",
        description: "The uid of the element to drop into",
        placeholder: "Enter target element UID",
      },
    },
  },

  response: {
    success: "Drag operation successful",
    result: "Drag operation result",
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
      description: "A network error occurred during the drag operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform drag operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Drag operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested element was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred during the drag operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during the drag operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the drag operation",
    },
  },

  success: {
    title: "Drag Operation Successful",
    description: "The element was dragged successfully",
  },
};
