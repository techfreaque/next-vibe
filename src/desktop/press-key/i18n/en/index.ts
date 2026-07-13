export const translations = {
  title: "Press Key",
  dynamicTitle: "Key: {{key}}",
  description: "Press a key or key combination using xdotool",
  form: {
    label: "Press Key",
    description:
      "Send a key press event to the desktop using xdotool key syntax",
    fields: {
      key: {
        label: "Key",
        description:
          "Key name or combination in xdotool syntax (e.g. Return, ctrl+c, alt+F4)",
        placeholder: "Return",
      },
      repeat: {
        label: "Repeat Count",
        description: "Number of times to press the key (default: 1)",
        placeholder: "1",
      },
      delay: {
        label: "Delay (ms)",
        description:
          "Delay between repeated key presses in milliseconds (default: 0)",
        placeholder: "0",
      },
      windowId: {
        label: "Window ID",
        description: "Focus this window UUID before pressing the key",
        placeholder: "{uuid}",
      },
      windowTitle: {
        label: "Window Title",
        description:
          "Focus window containing this title before pressing the key",
        placeholder: "Kate",
      },
    },
  },
  response: {
    success: "Key pressed successfully",
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
      description: "A network error occurred while pressing the key",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to press keys on the desktop",
    },
    forbidden: {
      title: "Forbidden",
      description: "Pressing keys on the desktop is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while pressing the key",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while pressing the key",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while pressing the key",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Key Pressed",
    description: "The key was pressed successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
  },
};
