export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  widget: {
    title: "Remote Connection",
    signInDescription: "Sign in to configure your remote connection",
    connected: {
      title: "Connected to cloud account",
      badge: "Active",
      description:
        "Your memories and AI tools sync automatically with your cloud account.",
      connectedTo: "Connected to",
      lastSynced: "Last synced",
      refresh: "Refresh",
      disconnect: "Disconnect",
    },
    notConnected: {
      title: "Connect your cloud account",
      description:
        "Connect to your cloud account (e.g. unbottled.ai) to sync your memories and use AI tools from your terminal — from anywhere.",
      benefit1:
        "Your memories automatically sync between this device and your cloud account",
      benefit2: "Run AI tools from the command line with",
      benefit2Code: "vibe --remote",
      benefit3: "Your cloud account and local instance stay in sync",
    },
  },
  get: {
    title: "Remote Connection Status",
    description: "Get the status of a specific remote connection",
    instanceId: {
      label: "Instance ID",
      description: "The connection instance to view",
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
        description: "You must be logged in to view your remote connection",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to view this",
      },
      notFound: {
        title: "Not Connected",
        description: "No remote connection found for this instance",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving your connection",
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
      title: "Connection Retrieved",
      description: "Remote connection status retrieved successfully",
    },
  },
  patch: {
    title: "Rename Connection",
    description: "Update the friendly name of a remote connection",
    instanceId: {
      label: "Instance ID",
      description: "The instance to rename",
      placeholder: "hermes",
    },
    friendlyName: {
      label: "Friendly Name",
      description: "A human-readable name for this connection",
      placeholder: "My Laptop",
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
