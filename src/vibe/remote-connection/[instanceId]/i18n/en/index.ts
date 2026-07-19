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
      transport: "Transport (outbound)",
      remoteTransport: "Their transport",
      remoteInstance: "Remote instance",
      capabilities: "Capabilities version",
      lastSynced: "Initial sync",
      wsConnected: "Connected since",
      refresh: "Refresh",
      transportReverseWs: "Reverse WS (tunnel)",
      transportDirectHttp: "Direct HTTP",
    },
    notConnected: {
      title: "Not connected",
      description:
        "Connect to a cloud account (e.g. unbottled.ai) to sync memories and call AI tools from your terminal — from anywhere.",
      benefit1:
        "Memories sync automatically between this device and your cloud account",
      benefit2: "Run AI tools from the command line with",
      benefit2Code: "vibe --remote",
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
    },
    // ── Cross-references ───────────────────────────────────────────────────
    cortexSection: "Cortex",
    cortexDescription: "Browse the shared file system for this connection.",
    cortexLink: "Open Cortex",
    sshSection: "SSH & Terminal",
    sshDescription:
      "SSH configurations and terminal sessions via this connection.",
    sshLink: "Open SSH connections",
    // ── Connection state banner ────────────────────────────────────────────
    state: {
      tunnelActive: "Tunnel open",
      bridgeActive: "Connected",
      degraded: "Connection degraded",
      connectionLost: "Connection lost",
      inactive: "Inactive",
      connectedSince: "Since",
      initialSync: "Synced",
    },
    // ── Actions ────────────────────────────────────────────────────────────
    reauthButton: "Re-authenticate",
    renameButton: "Rename",
    editButton: "Edit",
    reconnectButton: "Reconnect",
    disconnectButton: "Disconnect",
    disconnectConfirmTitle: "Disconnect this instance?",
    disconnectConfirmDescription:
      "The connection will be removed. You can reconnect at any time.",
    disconnectConfirmCancel: "Cancel",
    disconnectConfirmProceed: "Disconnect",
    // ── Edit section titles ────────────────────────────────────────────────
    edit: {
      identitySection: "Name",
      reauthSection: "Re-authenticate",
      transportSection: "Transport",
      behaviorSection: "Behavior",
    },
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
        "How this connection communicates. reverse-ws: persistent outbound WS (opens immediately on save). direct-http: direct HTTP calls.",
      options: {
        reverseWs: "Reverse WS",
        directHttp: "Direct HTTP",
      },
    },
    remoteTransportMode: {
      label: "Their Transport Mode",
      description:
        "How the peer reaches this side. reverse-ws: we hold an outbound connector to receive their sends. direct-http: they POST our bridge.",
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
    threadMirrorMode: {
      label: "Thread Mirroring",
      description:
        "Whether threads sync between this instance and the connected one. 'both' mirrors threads in both directions; 'off' keeps every thread where it was created.",
      options: {
        both: "Mirror both directions",
        off: "No mirroring",
      },
    },
    loopLocation: {
      label: "Loop Location",
      description:
        "Where a remote thread's AI loop runs. 'target' runs it on the connected instance (default); 'caller' keeps the loop here while tools still execute remotely.",
      options: {
        target: "On the connected instance",
        caller: "On this instance",
      },
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
