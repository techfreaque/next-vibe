export const translations = {
  title: "List Console Messages",
  description:
    "List all console messages for the currently selected page since the last navigation",
  form: {
    label: "List Console Messages",
    description: "Get all console messages from the browser page",
    fields: {
      includePreservedMessages: {
        label: "Include Preserved Messages",
        description:
          "Set to true to return the preserved messages over the last 3 navigations",
        placeholder: "false",
      },
      pageIdx: {
        label: "Page Index",
        description: "Page number to return (0-based, omit for first page)",
        placeholder: "Enter page index",
      },
      pageSize: {
        label: "Page Size",
        description:
          "Maximum number of messages to return (omit to return all messages)",
        placeholder: "Enter page size",
      },
      types: {
        label: "Message Types",
        description:
          "Filter messages to only return messages of the specified types (omit to return all)",
        placeholder: "Select message types",
        options: {
          log: "Log",
          debug: "Debug",
          info: "Info",
          error: "Error",
          warn: "Warning",
          dir: "Dir",
          dirxml: "Dirxml",
          table: "Table",
          trace: "Trace",
          clear: "Clear",
          startGroup: "Start Group",
          startGroupCollapsed: "Start Group Collapsed",
          endGroup: "End Group",
          assert: "Assert",
          profile: "Profile",
          profileEnd: "Profile End",
          count: "Count",
          timeEnd: "Time End",
          verbose: "Verbose",
          issue: "Issue",
        },
      },
    },
  },
  response: {
    success: "Console messages retrieved successfully",
    result: "Console messages list result",
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
      description: "A network error occurred while listing console messages",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to list console messages",
    },
    forbidden: {
      title: "Forbidden",
      description: "Listing console messages is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while listing console messages",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while listing console messages",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while listing console messages",
    },
  },
  success: {
    title: "Console Messages Retrieved Successfully",
    description: "The console messages were retrieved successfully",
  },
};
