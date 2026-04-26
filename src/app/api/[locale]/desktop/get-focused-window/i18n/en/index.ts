export const translations = {
  title: "Get Focused Window",
  description: "Get information about the currently focused window",
  form: {
    label: "Get Focused Window",
    description: "Retrieve the window ID, title, and PID of the active window",
    fields: {},
  },
  response: {
    success: "Focused window info retrieved successfully",
    windowId: "X11 window ID of the focused window",
    windowTitle: "Title text of the focused window",
    pid: "Process ID of the focused window",
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
      description: "A network error occurred while getting the focused window",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to get window information",
    },
    forbidden: {
      title: "Forbidden",
      description: "Getting window information is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "No focused window was found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while getting the focused window",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while getting the focused window",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while getting the focused window",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Focused Window Retrieved",
    description: "The focused window information was retrieved successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    windowManagement: "Window Management",
  },
};
