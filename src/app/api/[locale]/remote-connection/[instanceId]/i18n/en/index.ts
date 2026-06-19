export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  widget: {
    title: "Remote Connection",
    signInDescription: "Sign in to configure your remote connection",
    back: "Back",
    // ── Status section ─────────────────────────────────────────────────────
    statusSection: "Status",
    connected: {
      title: "Connected",
      badge: "Active",
      connectedTo: "Remote URL",
      transport: "Transport",
      remoteInstance: "Remote instance",
      capabilities: "Capabilities version",
      lastSynced: "Last synced",
      wsConnected: "WS connected",
      refresh: "Refresh",
    },
    notConnected: {
      title: "Not connected",
      description:
        "Connect to a cloud account (e.g. unbottled.ai) to sync memories and call AI tools from your terminal — from anywhere.",
      benefit1:
        "Memories sync automatically between this device and your cloud account",
      benefit2: "Run AI tools from the command line with",
      benefit2Code: "vibe --thea",
      benefit3: "Local and cloud stay in sync",
    },
    // ── Behavior section ───────────────────────────────────────────────────
    behaviorSection: "Behavior",
    // ── Sync section ───────────────────────────────────────────────────────
    syncSection: "Sync & Access",
    syncScope: {
      memories: "Memories",
      documents: "Documents",
      skills: "Skills",
      favorites: "Favorites",
      threads: "Threads",
      chat: "Chat",
    },
    // ── Live sync section ──────────────────────────────────────────────────
    liveSync: {
      title: "Live Event Sync",
      description: "Real-time events relayed across connected instances.",
      chatEvents: "Chat messages",
      liveOnlyBadge: "Live relay only",
    },
    // ── Cross-references ───────────────────────────────────────────────────
    cortexSection: "Cortex",
    cortexDescription: "Browse the shared file system for this connection.",
    cortexLink: "Open Cortex",
    sshSection: "SSH & Terminal",
    sshDescription:
      "SSH configurations and terminal sessions via this connection.",
    sshLink: "Open SSH connections",
    // ── Actions ────────────────────────────────────────────────────────────
    reauthButton: "Re-authenticate",
    renameButton: "Rename",
    editButton: "Edit",
    disconnectButton: "Disconnect",
    disconnectConfirmTitle: "Disconnect this instance?",
    disconnectConfirmDescription:
      "The connection will be removed. You can reconnect at any time.",
    disconnectConfirmCancel: "Cancel",
    disconnectConfirmProceed: "Disconnect",
  },
  get: {
    title: "Remote Connection Status",
    titleShort: "Connection",
    description: "Full status and settings for a specific remote connection",
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
    titleShort: "Update Connection",
    description:
      "Rename, re-authenticate, or configure transport and sync settings",
    // ── Rename ──────────────────────────────────────────────────────────────
    newInstanceId: {
      label: "New Name",
      description:
        "Rename this connection. Updates the local label and syncs to the remote.",
    },
    // ── Reauth ──────────────────────────────────────────────────────────────
    email: {
      label: "Email",
      description: "Your account email on the remote instance",
    },
    password: {
      label: "Password",
      description: "Your account password on the remote instance",
    },
    // ── Transport ────────────────────────────────────────────────────────────
    transportMode: {
      label: "Transport Mode",
      description:
        "How this connection communicates. reverse-ws: persistent outbound WS (opens immediately on save). direct-http: direct HTTP calls. ws-provider: remote runs AI loop. cloud-only: no outbound connection.",
    },
    // ── Behavior ────────────────────────────────────────────────────────────
    isInferenceProvider: {
      label: "Inference Provider",
      description:
        "Allow this connection to serve AI inference — remote instance runs the LLM loop over reverse-WS.",
    },
    forceSystemProvider: {
      label: "Force System Provider",
      description:
        "Admin override: route ALL AI streams through this connection, bypassing cost and per-user routing rules. One connection at a time.",
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
    // ── Sync scope ──────────────────────────────────────────────────────────
    syncScope: {
      label: "Sync Scope",
      description:
        "Which data providers sync over this connection: memories, documents, skills, favorites, threads.",
      memories: "Memories",
      documents: "Documents",
      skills: "Skills",
      favorites: "Favorites",
      threads: "Threads",
      chat: "Chat events",
    },
    reconnectNow: {
      label: "Reconnect Now",
      description:
        "Close and reopen the connection, triggering pull-on-connect sync.",
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Failed to connect" },
      unauthorized: {
        title: "Not Logged In",
        description: "Authentication required",
      },
      forbidden: {
        title: "Access Denied",
        description: "Admin role required for this field",
      },
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
      description: "Settings saved successfully",
    },
  },
  delete: {
    title: "Disconnect",
    titleShort: "Disconnect",
    description:
      "Remove this remote connection and close the WebSocket channel",
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Failed to connect" },
      unauthorized: {
        title: "Not Logged In",
        description: "Authentication required",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission",
      },
      notFound: { title: "Not Found", description: "Connection not found" },
      server: { title: "Server Error", description: "Failed to disconnect" },
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
      title: "Disconnected",
      description: "Remote connection removed successfully",
    },
  },
};
