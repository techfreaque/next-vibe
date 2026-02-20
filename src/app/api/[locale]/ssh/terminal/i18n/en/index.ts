export const translations = {
  get: {
    title: "Terminal",
    description: "Full PTY terminal in the browser",
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      server: { title: "Server Error", description: "Terminal unavailable" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      notFound: { title: "Not Found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
    },
    success: {
      title: "Terminal Ready",
      description: "Terminal session opened",
    },
  },
  widget: {
    title: "Terminal",
    connectButton: "Connect",
    disconnectButton: "Disconnect",
    localLabel: "Local (current user)",
    connectionLabel: "Connection",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    sessionError: "Session error",
    connectPrompt: "Press Connect to start a terminal session.\n",
    prompt: "$ ",
    inputPlaceholder: "Enter command and press Enter...",
  },
};
