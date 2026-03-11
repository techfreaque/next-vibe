export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  get: {
    title: "Remote Connections",
    description: "List all remote connections for your account",
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
    title: "Remote Connections",
    addButton: "Add Connection",
    emptyState: "No remote connections yet.",
    emptyStateCloud:
      "Link your local install here once it's running. Your memories and tools will sync automatically.",
    connectedBadge: "Connected",
    registeredBadge: "Registered",
    selfBadge: "Self",
    lastSynced: "Last synced",
    never: "Never",
    connectButton: "Link Local Instance",
    connectButtonLocal: "Connect to Cloud",
    inactiveBadge: "Inactive",
    instanceId: "Instance ID",
    friendlyName: "Name",
    remoteUrl: "Remote URL",
    viewButton: "View",
    editButton: "Rename",
    deleteButton: "Disconnect",
    // Cloud marketing panel
    cloud: {
      heroTitle: "Own Your AI. Run It Anywhere.",
      heroSubtitle:
        "unbottled.ai is your cloud brain. Add a local instance and your AI operates across both — memories sync, tools run on your machine, Claude Code executes on your hardware.",
      benefit1: "Memories sync bidirectionally, automatically",
      benefit2: "Cloud AI discovers and runs your local tools",
      benefit3: "Delegate tasks from cloud to your machine",
      feature1Title: "Your tools, your machine",
      feature1Body:
        "SSH, local files, code execution — the cloud AI discovers and runs your local tools automatically. No port forwarding. No VPN.",
      feature2Title: "Shared memory",
      feature2Body:
        "Everything you tell the AI here syncs to your local instance. Context travels with you.",
      feature3Title: "Zero lock-in",
      feature3Body:
        "It's open source. Fork it, self-host it, own every line. No black box.",
      feature4Title: "One command to start",
      feature4Body:
        "Clone the repo, add your API key, run vibe dev. Your personal AI stack is live in under a minute.",
      githubCta: "View on GitHub →",
      quickstartCta: "Quickstart Guide",
      alreadyHaveLocal: "Already running a local instance?",
      alreadyHaveLocalSub:
        "Connect from your local machine — open Remote Connections there and link it to this cloud instance.",
      connectSectionTitle: "Link Your Local Instance",
    },
    // Local panel
    local: {
      cloudTitle: "Connect to Cloud",
      cloudSubtitle:
        "Link this local instance to unbottled.ai (or any other cloud instance). Once connected, memories sync every 60 seconds and Thea can discover and execute your local tools.",
      benefit1: "Memories sync bidirectionally, automatically",
      benefit2: "Cloud AI discovers and runs your local tools",
      benefit3: "Delegate tasks from cloud to this machine",
      noConnectionsYet: "No connections yet.",
      connectionsTitle: "Linked Connections",
    },
  },
};
