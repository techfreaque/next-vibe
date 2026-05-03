export const translations = {
  title: "Move Mouse",
  dynamicTitle: "Move: {{x}},{{y}}",
  description: "Move the mouse cursor to absolute screen coordinates",
  form: {
    label: "Move Mouse",
    description: "Move the mouse cursor to the specified screen position",
    fields: {
      x: {
        label: "X Coordinate",
        description: "Horizontal screen coordinate in pixels (from left edge)",
        placeholder: "100",
      },
      y: {
        label: "Y Coordinate",
        description: "Vertical screen coordinate in pixels (from top edge)",
        placeholder: "200",
      },
    },
  },
  response: {
    success: "Mouse moved successfully",
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
      description: "A network error occurred while moving the mouse",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to move the mouse on the desktop",
    },
    forbidden: {
      title: "Forbidden",
      description: "Moving the mouse on the desktop is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while moving the mouse",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while moving the mouse",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while moving the mouse",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Mouse Moved",
    description: "The mouse cursor was moved successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
  },
};
