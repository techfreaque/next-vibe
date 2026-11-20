export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  get: {
    title: "Remote Connections",
    titleShort: "Connections",
    description: "List all remote connections for your account",
    fields: {
      activeOnly: {
        label: "Active only",
        description: "Only return active connections",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to view connections",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission",
      },
      server: {
        title: "Server Error",
        description: "Failed to list connections",
      },
      notFound: { title: "Not Found", description: "No connections found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Connections Listed",
      description: "Remote connections retrieved",
    },
  },
  widget: {
    loading: "Loading connections…",
    refresh: "Refresh connections",
    back: "Back",
    socketSince: "WebSocket open since",
    transportLabel: "Transport",
    viewConnection: "Open connection {{instance}}",
    pickConnection: "Choose",
    title: "Remote Connections",
    addButton: "Add Connection",
    emptyState:
      "No instances are linked. Link an instance to share selected data and tools.",
    emptyStateCloud: "No instance linked yet.",
    connectedBadge: "Connected",
    registeredBadge: "Registered",
    selfBadge: "Self",
    lastSynced: "Last sync exchange",
    never: "Never",
    connectButton: "Link Local Instance",
    connectButtonLocal: "Connect to Cloud",
    incomingBadge: "Incoming",
    inactiveBadge: "Inactive",
    inferenceProviderBadge: "Inference",
    transportBadge: "out {{out}} · in {{in}}",
    transport: {
      unknown: "Unknown",
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    instanceId: "Instance ID",
    remoteUrl: "Remote URL",
    viewButton: "View",
    editButton: "Edit",
    deleteButton: "Disconnect",
    // ── Health status labels ───────────────────────────────────────────────────
    health: {
      socketOpen: "WebSocket open",
      noSyncRecorded: "No sync recorded",
      syncRecorded: "Sync recorded",
      tunnelOpen: "Tunnel open",
      bridgeActive: "Connected",
      tunnelWarning: "Tunnel connecting",
      bridgeWarning: "Syncing",
      tunnelLost: "Tunnel lost",
      bridgeFailed: "Connection failed",
      disconnected: "Disconnected",
      reauthRequired: "Sign-in required",
      incomingActive: "Active",
    },
    // ── Reconnect button labels ────────────────────────────────────────────────
    reconnectButton: {
      reauth: "Sign in again",
      reconnect: "Reconnect",
      retry: "Retry",
      resync: "Re-sync",
    },
    // Cloud marketing panel
    cloud: {
      heroTitle: "Bring your own instance",
      heroSubtitle:
        "Run next-vibe on your own hardware and link it to this account. Your chats, memories and skills follow you. Your tools run on your machine.",
      stepsTitle: "Connect in three steps",
      step1Title: "Install next-vibe",
      step1Body: "Open source. Runs on a laptop, a home server or a VPS.",
      step2Title: "Link it from your instance",
      step2Body:
        "On your instance open Subscription, then Cloud Sync, then Connect to Cloud. Enter {{appUrl}} and the login of this account. In a terminal on that machine:",
      step2Command: "vibe remote-connect -i",
      step3Title: "Pick what syncs",
      step3Body:
        "Memories, documents, skills, favorites, chats. One switch each, changed any time on your instance.",
      githubCta: "View on GitHub",
      quickstartCta: "Quick start",
      trustTitle: "What a linked instance can do",
      trust1:
        "It acts as you. It reads and writes your own chats, memories and skills. Nothing from any other account.",
      trust2:
        "Admin tools stay locked. Your instance gets exactly the rights your account has.",
      trust3:
        "AI runs it sends here bill your credits at the normal rate: provider cost plus 30%.",
      trust4:
        "Up to {{max}} instances. Disconnect one below and its link stops at once.",
      paidTitle: "Paid accounts only",
      paidBody:
        "Linking your own instance needs a paid account. Any credit pack or subscription unlocks it.",
      paidCta: "Unlock it",
      alreadyHaveLocal: "Your linked instances",
      alreadyHaveLocalSub:
        "Each one acts as this account. Open one to check its status or disconnect it.",
    },
    // Local panel
    local: {
      cloudTitle: "Connect to Cloud",
      cloudSubtitle:
        "Link this instance to a cloud instance to sync selected data and run local tools from the cloud.",
      benefit1: "Memories sync bidirectionally, automatically",
      benefit2: "Cloud AI discovers and runs your local tools",
      benefit3: "Delegate tasks from cloud to this machine",
      noConnectionsYet: "Nothing linked yet",
      connectionsTitle: "Linked Connections",
    },
    // Self-identity
    selfIdentity: {
      title: "Your Instance ID",
      description:
        "Other instances see this server as this ID. Must be unique across all connected instances.",
    },
    // Sync settings (admin only)
    syncSettings: {
      title: "Auto-Sync",
      description:
        "Sync tasks and memories with all connected instances every minute",
      enabledBadge: "Active",
      disabledBadge: "Inactive",
      toggleLabel: "Toggle auto-sync",
    },
  },
};
