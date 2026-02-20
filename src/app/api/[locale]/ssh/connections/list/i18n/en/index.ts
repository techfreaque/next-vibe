export const translations = {
  get: {
    title: "List SSH Connections",
    description: "List all saved SSH connections for the current user",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to list connections",
      },
      notFound: { title: "Not Found", description: "Not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "Connections Listed",
      description: "SSH connections retrieved",
    },
  },
  widget: {
    title: "SSH Connections",
    addButton: "Add Connection",
    testButton: "Test",
    deleteButton: "Delete",
    emptyState:
      "No SSH connections yet. Add one to connect to remote machines.",
    labelCol: "Label",
    hostCol: "Host",
    userCol: "User",
    authTypeCol: "Auth",
    defaultBadge: "Default",
    testingLabel: "Testing...",
    testSuccess: "Connected",
    testFailed: "Failed",
  },
};
