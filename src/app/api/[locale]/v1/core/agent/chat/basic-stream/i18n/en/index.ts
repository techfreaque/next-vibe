export const translations = {
  post: {
    title: "Basic Stream",
    description: "Stream messages progressively with customizable parameters",
    form: {
      title: "Stream Configuration",
      description: "Configure stream parameters",
    },
    count: {
      label: "Message Count",
      description: "Number of messages to stream (1-100)",
    },
    delay: {
      label: "Delay (ms)",
      description: "Delay between messages in milliseconds (100-5000)",
    },
    prefix: {
      label: "Message Prefix",
      description: "Prefix for each message",
    },
    includeTimestamp: {
      label: "Include Timestamp",
      description: "Add timestamp to each message",
    },
    includeCounter: {
      label: "Include Counter",
      description: "Add counter to each message",
    },
    response: {
      title: "Stream Response",
      description: "Streaming response metadata",
      success: "Stream completed successfully",
      totalMessages: "Total messages sent",
      duration: "Stream duration (ms)",
      completed: "Stream completion status",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for streaming",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while streaming",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to streaming is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Streaming endpoint not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred during streaming",
      },
    },
    success: {
      title: "Success",
      description: "Stream completed successfully",
    },
  },
  streamingErrors: {
    basicStream: {
      error: {
        processing: "Error processing stream",
        initialization: "Failed to initialize stream",
      },
    },
  },
};
