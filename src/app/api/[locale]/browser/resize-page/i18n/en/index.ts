export const translations = {
  title: "Resize Page",
  description: "Resize the selected page's window",
  form: {
    label: "Resize Page",
    description: "Resize the page to specified dimensions",
    fields: {
      width: {
        label: "Width",
        description: "Page width in pixels",
        placeholder: "Enter width",
      },
      height: {
        label: "Height",
        description: "Page height in pixels",
        placeholder: "Enter height",
      },
    },
  },
  response: {
    success: "Page resize operation successful",
    result: "Result of page resize operation",
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
      description: "A network error occurred while resizing the page",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to resize pages",
    },
    forbidden: {
      title: "Forbidden",
      description: "Page resize operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while resizing the page",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while resizing the page",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while resizing the page",
    },
  },
  success: {
    title: "Page Resized Successfully",
    description: "The page was resized successfully",
  },
};
