export const translations = {
  title: "List Monitors",
  description:
    "List all connected monitors with resolution, position, and index",
  form: {
    label: "List Monitors",
    description:
      "Enumerate all connected displays. Use monitor names to target specific screens for screenshots.",
    fields: {},
  },
  response: {
    success: "Monitors listed successfully",
    monitors: "Array of connected monitors",
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
      description: "A network error occurred while listing monitors",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to list monitors",
    },
    forbidden: {
      title: "Forbidden",
      description: "Listing monitors is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while listing monitors",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while listing monitors",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while listing monitors",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "Monitor listing is not available on your operating system",
    },
  },
  success: {
    title: "Monitors Listed",
    description: "All connected monitors were listed successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    captureAutomation: "Capture Automation",
  },
};
