export const translations = {
  title: "Take Snapshot",
  description:
    "Take a text snapshot of the currently selected page based on the accessibility tree",
  form: {
    label: "Take Snapshot",
    description:
      "Capture a text snapshot of the browser page based on the a11y tree",
    fields: {
      verbose: {
        label: "Verbose",
        description:
          "Whether to include all possible information available in the full a11y tree (default: false)",
        placeholder: "false",
      },
      filePath: {
        label: "File Path",
        description:
          "The absolute path, or a path relative to the current working directory, to save the snapshot to instead of attaching it to the response",
        placeholder: "/path/to/snapshot.txt",
      },
    },
  },
  response: {
    success: "Snapshot captured successfully",
    result: "Snapshot capture result",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while capturing the snapshot",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to capture snapshots",
    },
    forbidden: {
      title: "Forbidden",
      description: "Capturing snapshots is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while capturing the snapshot",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while capturing the snapshot",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while capturing the snapshot",
    },
  },
  success: {
    title: "Snapshot Captured Successfully",
    description: "The snapshot was captured successfully",
  },
};
