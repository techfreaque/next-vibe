export const translations = {
  title: "Scroll",
  dynamicTitle: "Scroll: {{direction}}",
  description: "Scroll at the current mouse position or specified coordinates",
  form: {
    label: "Scroll",
    description: "Scroll up, down, left, or right at the given position",
    fields: {
      x: {
        label: "X Coordinate",
        description:
          "Horizontal position to scroll at (uses current position if omitted)",
        placeholder: "100",
      },
      y: {
        label: "Y Coordinate",
        description:
          "Vertical position to scroll at (uses current position if omitted)",
        placeholder: "200",
      },
      direction: {
        label: "Direction",
        description: "Scroll direction",
        placeholder: "down",
        options: {
          up: "Up",
          down: "Down",
          left: "Left",
          right: "Right",
        },
      },
      amount: {
        label: "Amount",
        description: "Number of scroll steps (default: 3)",
        placeholder: "3",
      },
    },
  },
  response: {
    success: "Scroll performed successfully",
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
      description: "A network error occurred while scrolling",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to scroll on the desktop",
    },
    forbidden: {
      title: "Forbidden",
      description: "Scrolling on the desktop is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while scrolling",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while scrolling",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while scrolling",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Scroll Performed",
    description: "The scroll was performed successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
  },
};
