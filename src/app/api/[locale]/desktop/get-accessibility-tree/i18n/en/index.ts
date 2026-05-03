export const translations = {
  title: "Get Accessibility Tree",
  dynamicTitle: "A11y: {{app}}",
  description:
    "Get the accessibility tree of the focused window or a specific application",
  form: {
    label: "Get Accessibility Tree",
    description:
      "Retrieve the AT-SPI accessibility tree for desktop UI inspection",
    fields: {
      appName: {
        label: "Application Name",
        description:
          "Process name or window title to target (omit for focused window)",
        placeholder: "firefox",
      },
      maxDepth: {
        label: "Max Depth",
        description: "Maximum tree depth to traverse (default: 5)",
        placeholder: "5",
      },
      includeActions: {
        label: "Include Actions",
        description:
          "Show available actions per node (click, press, activate...). More detail but bigger output.",
        placeholder: "false",
      },
    },
  },
  response: {
    success: "Accessibility tree retrieved successfully",
    tree: "Accessibility tree as structured text",
    nodeCount: "Total number of nodes traversed",
    truncated: "Whether the query timed out and output may be incomplete",
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
      description:
        "A network error occurred while retrieving the accessibility tree",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to access the accessibility tree",
    },
    forbidden: {
      title: "Forbidden",
      description: "Accessing the accessibility tree is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The target application or window was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while retrieving the accessibility tree",
    },
    unknown: {
      title: "Unknown Error",
      description:
        "An unknown error occurred while retrieving the accessibility tree",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description:
        "A conflict occurred while retrieving the accessibility tree",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Accessibility Tree Retrieved",
    description: "The accessibility tree was retrieved successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    accessibilityAutomation: "Accessibility Automation",
  },
};
