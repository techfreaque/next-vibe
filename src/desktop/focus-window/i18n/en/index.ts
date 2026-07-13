export const translations = {
  title: "Focus Window",
  dynamicTitle: "Focus: {{target}}",
  description: "Bring a window to the foreground and give it focus",
  form: {
    label: "Focus Window",
    description: "Focus a window by its ID, PID, or title",
    fields: {
      windowId: {
        label: "Window ID",
        description:
          "X11 window ID (hexadecimal, e.g. 0x1234). Takes priority over other options.",
        placeholder: "0x1234",
      },
      pid: {
        label: "Process ID",
        description: "Focus the window belonging to this process ID",
        placeholder: "12345",
      },
      title: {
        label: "Window Title",
        description:
          "Focus the window whose title contains this string (case-sensitive)",
        placeholder: "Firefox",
      },
    },
  },
  response: {
    success: "Window focused successfully",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please provide at least one of: windowId, pid, or title",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while focusing the window",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to focus windows",
    },
    forbidden: {
      title: "Forbidden",
      description: "Focusing windows is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The specified window was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while focusing the window",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while focusing the window",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while focusing the window",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Window Focused",
    description: "The window was brought to the foreground successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    windowManagement: "Window Management",
  },
};
