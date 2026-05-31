export const translations = {
  category: "System",
  tags: {
    taskSync: "Task Sync",
  },
  get: {
    title: "Task Sync Settings",
    description: "Get the current task sync settings",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Access Denied",
        description: "Admin access required",
      },
      server: {
        title: "Server Error",
        description: "Failed to load sync settings",
      },
      notFound: {
        title: "Not Found",
        description: "Task not found",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Settings Loaded",
      description: "Task sync settings retrieved",
    },
  },
  patch: {
    title: "Update Sync Settings",
    description: "Enable or disable the task sync cron job",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Access Denied",
        description: "Admin access required",
      },
      server: {
        title: "Server Error",
        description: "Failed to update sync settings",
      },
      notFound: {
        title: "Not Found",
        description: "Task not found",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Settings Updated",
      description: "Task sync settings saved",
    },
    syncEnabled: {
      label: "Auto-sync enabled",
      description:
        "When enabled, tasks and memories sync every minute with all connected remote instances",
    },
  },
};
