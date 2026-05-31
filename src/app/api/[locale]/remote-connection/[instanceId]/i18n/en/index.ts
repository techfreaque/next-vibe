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
      reauth: "Re-authenticate",
      rename: "Rename",
      settings: "Settings",
      disconnect: "Disconnect",
    },
    notConnected: {
      title: "Connect your cloud account",
      description:
        "Connect to your cloud account (e.g. unbottled.ai) to sync your memories and use AI tools from your terminal - from anywhere.",
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
    title: "Update Remote Connection",
    description:
      "Configure transport, loop, and sync settings for this connection",
    isSystemProvider: {
      label: "System Provider",
      description:
        "Use this connection as the reverse WS provider for remote tool dispatch",
    },
    loopLocation: {
      label: "AI Loop Location",
      description:
        "Where the AI inference loop runs. Client: local machine handles the loop. Server: remote instance handles it.",
    },
    threadMirrorMode: {
      label: "Thread Storage",
      description:
        "Where threads created in this connection's folder are stored. Cloud: cloud only. Local: local only. Both: mirrored. None: no storage.",
    },
    toolSource: {
      label: "Tool Source",
      description:
        "Which tools are available in AI streams routed to this connection. Local: your local tools. Remote: remote tools only. Both: merge both.",
    },
    routingRules: {
      label: "Routing Rules",
      description:
        "Declarative routing rules: folder IDs whose AI streams route here, model providers handled by this connection, and whether it is the default fallback.",
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Failed to connect" },
      unauthorized: {
        title: "Not Logged In",
        description: "Authentication required",
      },
      forbidden: { title: "Access Denied", description: "Admin role required" },
      notFound: { title: "Not Found", description: "Connection not found" },
      server: {
        title: "Server Error",
        description: "Failed to update connection",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
    },
    success: {
      title: "Connection Updated",
      description: "System provider setting updated and connector reloaded",
    },
  },
};
