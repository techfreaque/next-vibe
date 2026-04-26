export const translations = {
  title: "Type Text",
  description: "Type text into the focused window using keyboard simulation",
  form: {
    label: "Type Text",
    description: "Send keystrokes to the focused window to type text",
    fields: {
      text: {
        label: "Text",
        description: "The text to type into the focused window",
        placeholder: "Hello, World!",
      },
      delay: {
        label: "Delay (ms)",
        description: "Delay between keystrokes in milliseconds (default: 12)",
        placeholder: "12",
      },
      windowId: {
        label: "Window ID",
        description: "Focus this window UUID before typing (from list-windows)",
        placeholder: "{uuid}",
      },
      windowTitle: {
        label: "Window Title",
        description: "Focus window containing this title before typing",
        placeholder: "Kate",
      },
    },
  },
  response: {
    success: "Text typed successfully",
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
      description: "A network error occurred while typing text",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to type text on the desktop",
    },
    forbidden: {
      title: "Forbidden",
      description: "Typing text on the desktop is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while typing text",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while typing text",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while typing text",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Text Typed",
    description: "The text was typed successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
  },
};
