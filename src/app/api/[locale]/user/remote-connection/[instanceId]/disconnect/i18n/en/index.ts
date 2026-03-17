export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  delete: {
    title: "Disconnect",
    description: "Remove the connection to your remote instance",
    instanceId: {
      label: "Instance ID",
      description: "The instance to disconnect",
      placeholder: "hermes",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to disconnect",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to disconnect",
      },
      notFound: {
        title: "Not Connected",
        description: "No remote connection to disconnect",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while disconnecting",
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
      title: "Disconnected",
      description: "Your remote connection has been removed",
    },
  },
};
