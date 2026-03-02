export const translations = {
  category: "AI",
  tags: {
    streaming: "Streaming",
  },
  post: {
    title: "Cancel AI Stream",
    description: "Cancel an active AI streaming response",
    container: {
      title: "Cancel Stream",
      description: "Stop an active AI stream for a thread",
    },
    form: {
      title: "Cancel Stream",
      description: "Provide the thread ID to cancel its active stream",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread whose stream to cancel",
    },
    response: {
      title: "Cancel Result",
      description: "Result of the cancel operation",
      cancelled: "Whether an active stream was found and cancelled",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid cancel request data",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to cancel streams",
      },
      forbidden: {
        title: "Forbidden",
        description: "You can only cancel your own streams",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to cancel stream",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Cancel conflict occurred",
      },
    },
    success: {
      title: "Stream Cancelled",
      description: "The AI stream has been cancelled successfully",
    },
  },
};
