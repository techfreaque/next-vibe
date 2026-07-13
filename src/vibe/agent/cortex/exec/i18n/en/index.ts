export const translations = {
  post: {
    title: "Execute Command",
    titleShort: "Run Command",
    description:
      "Run a shell command on a machine. Only works on /ssh/ paths. Persistent terminal — cwd carries over between calls. New sessions start in the default mount directory if configured.",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "Running...",
      done: "Done",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Machine",
        description:
          'SSH machine path. Must start with /ssh/. Use cortex-list(path="/ssh") to find machines and their mounts.',
      },
      command: {
        label: "Command",
        description: "Shell command to execute",
        placeholder: "echo hello",
      },
      workingDir: {
        label: "Working Directory",
        description:
          "Override cwd for this command. If omitted, uses the terminal's current directory.",
        placeholder: "/home/user/project",
      },
      terminalId: {
        label: "Terminal ID",
        description:
          "Reuse a specific terminal session. If omitted, uses the default terminal for this connection.",
      },
      timeoutMs: {
        label: "Timeout (ms)",
        description: "Max execution time. Default 30000ms. Max 300000ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Run",
      loadingText: "Running...",
    },
    response: {
      output: { content: "Output" },
      exitCode: { title: "Exit Code" },
      cwd: { content: "Working Directory" },
      terminalId: { content: "Terminal ID" },
      backend: { title: "Backend" },
      truncated: { title: "Truncated" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Check path and command",
      },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: {
        title: "No Access",
        description: "No permission for this machine",
      },
      notFound: {
        title: "Machine Not Found",
        description: "No SSH connection or remote instance at this path",
      },
      server: { title: "Exec Failed", description: "Command execution failed" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Session Conflict",
        description: "Terminal session is busy",
      },
    },
    success: {
      title: "Command Complete",
      description: "Command executed",
    },
  },
  errors: {
    invalidWorkingDir:
      "Working directory must be an absolute path without '..'",
    commandTimedOut: "Command timed out",
    invalidPath: "Path must start with /ssh/",
    noConnection: "No connection found at this path",
    connectionNotFound: "Connection not found",
    encryptionFailed: "Encryption failed - JWT_SECRET_KEY may be invalid",
    connectTimeout: "Connection timed out",
    sshAuthFailed: "SSH authentication failed",
    sshConnectionFailed: "SSH connection failed",
    fingerprintMismatch:
      "Host fingerprint changed - possible security risk. Delete and re-add the connection.",
    remoteNotSupported:
      "Remote connection exec is not yet supported. Use a direct SSH connection.",
  },
  log: {
    execComplete: "Command executed",
    openedLocal: "Opened local terminal",
    failedLocal: "Failed to open local terminal",
    openedSsh: "Opened SSH terminal",
    failedFingerprint: "Failed to save fingerprint",
    failedPty: "Failed to open SSH PTY",
    escalated: "Escalated long-running command to background task",
  },
  widget: {
    title: "Terminal",
    back: "Back",
    machineLabel: "Machine",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Type a command...",
    runButton: "Run",
    running: "Running...",
    clearButton: "Clear",
    ctrlEnterHint: "Ctrl+Enter to run",
    exitCodeLabel: "Exit Code",
    backendLabel: "Backend",
    cwdLabel: "Working Directory",
    terminalLabel: "Terminal",
    truncatedWarning: "Output truncated",
    emptyOutput: "No output",
    outputLabel: "Output appears here",
    outputTitle: "Output",
    historyTitle: "History",
    noHistory: "No commands yet",
    manageConnections: "Connections",
    viewTerminals: "Terminals",
    successStatus: "Success",
    failedStatus: "Failed",
    picker: {
      browse: "Browse",
      cancel: "Cancel",
      machinesTitle: "Pick a machine",
      machines: "Machines",
      loading: "Loading...",
      noMachines: "No machines configured",
      defaultBadge: "Default",
      useDir: "Use this directory",
      emptyDir: "Empty directory",
    },
  },
};
