export const translations = {
  title: "Move Window to Monitor",
  dynamicTitle: "Move: {{target}}",
  description: "Move a window to a specific monitor",
  form: {
    label: "Move Window to Monitor",
    description: "Move a window by its ID, PID, or title to a target monitor",
    fields: {
      windowId: {
        label: "Window ID",
        description:
          "KWin internal window UUID (from list-windows). Takes priority over pid and title.",
        placeholder: "{uuid}",
      },
      pid: {
        label: "Process ID",
        description: "Move the window belonging to this process ID",
        placeholder: "12345",
      },
      title: {
        label: "Window Title",
        description:
          "Move the window whose title contains this string (case-insensitive)",
        placeholder: "Firefox",
      },
      monitorName: {
        label: "Monitor Name",
        description:
          "Target monitor name (e.g. DP-1, HDMI-A-1). Use list-monitors to see available names.",
        placeholder: "DP-1",
      },
      monitorIndex: {
        label: "Monitor Index",
        description:
          "Target monitor index (0-based). Use monitorName when possible.",
        placeholder: "0",
      },
    },
  },
  response: {
    success: "Whether the move succeeded",
    movedTo: "Monitor the window was moved to",
    windowTitle: "Title of the window that was moved",
    error: "Error message if the operation failed",
    executionId: "Unique identifier for this execution",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description:
        "Please provide at least one window identifier and a monitor target",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while moving the window",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to move windows",
    },
    forbidden: {
      title: "Forbidden",
      description: "Moving windows is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The specified window or monitor was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while moving the window",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while moving the window",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while moving the window",
    },
  },
  success: {
    title: "Window Moved",
    description: "The window was moved to the target monitor successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    windowManagement: "Window Management",
  },
};
