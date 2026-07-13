export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Private Key (PEM)",
      keyAgent: "SSH Agent",
      local: "Local Machine",
    },
  },

  get: {
    title: "Connections",
    titleShort: "Connections",
    description:
      "All machines you can connect to — local shell, SSH servers, and remote instances",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to list connections",
      },
      notFound: { title: "Not Found", description: "Not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "Connections Listed",
      description: "All machine connections retrieved",
    },
    response: {
      connections: {
        title: "Connections",
      },
    },
  },
  widget: {
    title: "Connections",
    back: "Back",
    addSsh: "Add SSH",
    connectRemote: "Connect Remote",
    openTerminal: "Terminal",
    viewRemote: "Details",
    defaultBadge: "Default",
    localType: "Local",
    sshType: "SSH",
    remoteType: "Remote",
    healthHealthy: "Connected",
    healthWarning: "Slow",
    healthCritical: "Unreachable",
    healthDisconnected: "Offline",
    noConnections: "No machines configured",
    noConnectionsHint:
      "Add an SSH connection or connect a remote instance to get started.",
    emptyState: "No connections yet. Add one to connect to remote machines.",
  },
};
