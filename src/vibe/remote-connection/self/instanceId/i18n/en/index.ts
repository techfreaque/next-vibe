export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  get: {
    title: "This Instance's ID",
    titleShort: "Instance ID",
    description: "Read the identifier of your own instance on this machine",
    instanceId: {
      label: "Instance ID",
      description: "The identifier of this instance",
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
        description: "You must be logged in to read this instance's ID",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to read this instance's ID",
      },
      notFound: {
        title: "Not Found",
        description: "Instance identity not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while reading the instance ID",
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
      title: "Instance ID",
      description: "Resolved this instance's ID",
    },
  },
};
