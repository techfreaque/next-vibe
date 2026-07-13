export const translations = {
  title: "Click",
  dynamicTitle: "Click: {{x}},{{y}}",
  description:
    "Move the mouse to absolute coordinates and perform a mouse click",
  form: {
    label: "Click",
    description: "Move the mouse to the given coordinates and click",
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
      button: {
        label: "Mouse Button",
        description: "Mouse button to click (left, middle, right)",
        placeholder: "left",
        options: {
          left: "Left",
          middle: "Middle",
          right: "Right",
        },
      },
      doubleClick: {
        label: "Double Click",
        description: "Perform a double click instead of a single click",
        placeholder: "false",
      },
    },
  },
  response: {
    success: "Click performed successfully",
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
      description: "A network error occurred while performing the click",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform desktop clicks",
    },
    forbidden: {
      title: "Forbidden",
      description: "Performing desktop clicks is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while performing the click",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while performing the click",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while performing the click",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Click Performed",
    description: "The mouse click was performed successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
  },
};
