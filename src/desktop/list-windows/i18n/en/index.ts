export const translations = {
  title: "List Windows",
  description: "List all open windows on the desktop",
  form: {
    label: "List Windows",
    description:
      "Retrieve a list of all open windows with their IDs, titles, and positions",
    fields: {},
  },
  response: {
    success: "Window list retrieved successfully",
    windows: "List of open windows",
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
      description: "A network error occurred while listing windows",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to list windows",
    },
    forbidden: {
      title: "Forbidden",
      description: "Listing windows is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "No windows were found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while listing windows",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while listing windows",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while listing windows",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Windows Listed",
    description: "The window list was retrieved successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    windowManagement: "Window Management",
  },
};
