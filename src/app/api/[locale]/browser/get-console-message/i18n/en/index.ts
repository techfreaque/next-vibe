export const translations = {
  title: "Get Console Message",
  description: "Get a console message by its ID",
  form: {
    label: "Get Console Message",
    description: "Retrieve a specific console message",
    fields: {
      msgid: {
        label: "Message ID",
        description: "The msgid of a console message from the listed console messages",
        placeholder: "Enter message ID",
      },
    },
  },
  response: {
    success: "Console message retrieval operation successful",
    result: "Result of the console message retrieval",
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
      description: "A network error occurred while retrieving the console message",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to retrieve console messages",
    },
    forbidden: {
      title: "Forbidden",
      description: "Console message retrieval operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while retrieving the console message",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while retrieving the console message",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while retrieving the console message",
    },
  },
  success: {
    title: "Console Message Retrieved Successfully",
    description: "The console message was retrieved successfully",
  },
};
