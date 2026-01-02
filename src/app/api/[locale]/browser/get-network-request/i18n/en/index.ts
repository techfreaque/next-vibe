export const translations = {
  title: "Get Network Request",
  description:
    "Gets a network request by an optional reqid, if omitted returns the currently selected request in the DevTools Network panel",
  form: {
    label: "Get Network Request",
    description: "Get a specific network request or the currently selected one",
    fields: {
      reqid: {
        label: "Request ID",
        description:
          "The reqid of the network request (omit to get currently selected request in DevTools)",
        placeholder: "Enter request ID",
      },
    },
  },
  response: {
    success: "Network request retrieved successfully",
    result: "Network request retrieval result",
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
      description: "A network error occurred while getting the network request",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to get network requests",
    },
    forbidden: {
      title: "Forbidden",
      description: "Getting network requests is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while getting the network request",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while getting the network request",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while getting the network request",
    },
  },
  success: {
    title: "Network Request Retrieved Successfully",
    description: "The network request was retrieved successfully",
  },
};
