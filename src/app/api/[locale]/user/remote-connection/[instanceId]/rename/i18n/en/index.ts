export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  patch: {
    title: "Rename Connection",
    description: "Update the friendly name of a remote connection",
    instanceId: {
      label: "Instance ID",
      description: "The instance to rename",
      placeholder: "hermes",
    },
    newInstanceId: {
      label: "New Instance ID",
      description: "The new identifier for this connection",
      placeholder: "hermes-work",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to rename a connection",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to rename this connection",
      },
      notFound: {
        title: "Not Found",
        description: "Connection not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while renaming",
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
    },
    success: {
      title: "Renamed",
      description: "Connection renamed successfully",
    },
  },
};
