export const translations = {
  category: "System",

  post: {
    title: "Report Client Error",
    description: "Persist a client-side error or warning to the error log",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      level: {
        label: "Level",
        description: "Log level: error or warn",
      },
      message: {
        label: "Message",
        description: "Error message",
        placeholder: "Something went wrong",
      },
      metadata: {
        label: "Metadata",
        description: "Additional structured context",
      },
    },
    response: {
      ok: {
        title: "Accepted",
      },
    },
    success: {
      title: "Logged",
      description: "Client error persisted",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to persist error log",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        titleChanges: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
  },
};
