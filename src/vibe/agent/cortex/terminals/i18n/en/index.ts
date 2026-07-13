export const translations = {
  widget: {
    title: "Active Terminals",
    back: "Back",
    lastCommand: "Last command",
    noTerminals: "No active terminals",
    noTerminalsHint:
      "Run a command with Execute Command to start a terminal session.",
    openExec: "Execute Command",
    terminalCount: "terminals",
    machineLabel: "Machine",
    cwdLabel: "cwd",
    statusLabel: "Status",
    openedLabel: "Opened",
    openTerminal: "Open",
    manageConnections: "Connections",
    activeStatus: "Active",
  },
  get: {
    title: "List Terminals",
    titleShort: "Terminals",
    description:
      "List active terminal sessions with current working directories.",
    dynamicTitle: "Terminals: {{path}}",
    status: {
      loading: "Loading...",
      done: "Loaded",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Machine",
        description:
          "Filter to a specific machine, e.g. /ssh/local-machine. Omit to list all.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "Terminal ID" },
        connectionSlug: { content: "Machine" },
        cwd: { content: "Working Directory" },
        name: { content: "Name" },
        openedAt: { content: "Opened" },
        lastCommandAt: { content: "Last Command" },
        status: { content: "Status" },
      },
      total: { text: "Total" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Check the path",
      },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: {
        title: "No Access",
        description: "Not allowed",
      },
      notFound: {
        title: "Not Found",
        description: "No terminals found",
      },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Conflict",
        description: "Conflicting operation",
      },
    },
    success: {
      title: "Terminals Listed",
      description: "Active terminals loaded",
    },
  },
};
