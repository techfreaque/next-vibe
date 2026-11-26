export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  patch: {
    title: "Rename this instance",
    titleShort: "Rename instance",
    description: "Update the friendly name of your own instance",
    renaming: "Renaming…",
    newInstanceId: {
      label: "New instance name",
      description:
        "Connected instances see this server under this name. Must be unique, up to 32 characters.",
      placeholder: "hermes",
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
        description: "You must be logged in to rename this instance",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to rename this instance",
      },
      notFound: {
        title: "Not Found",
        description: "Instance identity not found",
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
      description: "Instance renamed successfully",
    },
  },
};
