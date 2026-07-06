export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  widget: {
    title: "Reverse Sync",
    description:
      "System endpoint. Called by the initiating instance to mirror syncScope changes to the remote side.",
    note: "Not user-facing — invoked automatically on connection settings update.",
  },
  patch: {
    title: "Update Reverse Connection",
    titleShort: "Update Reverse",
    description:
      "Called by the initiating instance to sync connection settings to the other side",
    syncScope: {
      label: "Sync Scope",
      description: "Which data domains to sync over this connection",
    },
    newInstanceId: {
      label: "New Instance Name",
      description: "The caller's new instance name — updates our label for it",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your details and try again",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to update the connection",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to update this connection",
      },
      notFound: {
        title: "Not Found",
        description: "No reverse connection found for this instance",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the connection",
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
        description: "A conflict occurred while updating the connection",
      },
    },
    success: {
      title: "Connection Updated",
      description: "The reverse connection settings have been updated",
    },
  },
};
