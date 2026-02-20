export const translations = {
  post: {
    title: "Run Command",
    description:
      "Execute a shell command on the local machine or a remote SSH connection",
    fields: {
      connectionId: {
        label: "Connection",
        description:
          "SSH connection to use. Leave empty to run locally as the current user.",
        placeholder: "Local (current user)",
      },
      command: {
        label: "Command",
        description: "Shell command to execute",
        placeholder: "ls -la",
      },
      workingDir: {
        label: "Working Directory",
        description: "Directory to run the command in",
        placeholder: "/home/user",
      },
      timeoutMs: {
        label: "Timeout (ms)",
        description: "Maximum time to wait for the command to complete",
        placeholder: "30000",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid command parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to run commands",
      },
      server: {
        title: "Server Error",
        description: "Failed to execute command",
      },
      timeout: {
        title: "Timeout",
        description: "Command timed out",
      },
      notFound: {
        title: "Connection Not Found",
        description: "SSH connection not found",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
      },
      conflict: {
        title: "Conflict",
        description: "Conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Command Executed",
      description: "Command completed successfully",
    },
  },
  widget: {
    title: "Command Runner",
    runButton: "Run",
    clearButton: "Clear",
    running: "Running...",
    localLabel: "Local (current user)",
    connectionLabel: "Connection",
    workingDirLabel: "Working Directory",
    timeoutLabel: "Timeout",
    outputLabel: "Output",
    stdoutLabel: "stdout",
    stderrLabel: "stderr",
    exitCodeLabel: "Exit Code",
    durationLabel: "Duration",
    backendLabel: "Backend",
    emptyOutput: "No output",
    truncatedWarning:
      "Output was truncated. Use the file viewer to read large files.",
    historyLabel: "History",
    noHistory: "No commands run yet",
    placeholder: "Enter command...",
    ctrlEnterHint: "Ctrl+Enter to run",
  },
};
