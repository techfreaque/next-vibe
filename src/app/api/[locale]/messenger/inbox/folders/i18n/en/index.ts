export const translations = {
  title: "List Folders",
  description: "List available folders for a messenger account",
  tag: "Inbox",

  container: {
    title: "Folders",
    description: "Available folders for the selected account",
  },

  accountId: {
    label: "Account",
    description: "Messenger account to list folders for",
    placeholder: "Account UUID",
  },

  folders: {
    label: "Folders",
    path: { label: "Path" },
    name: { label: "Name" },
    displayName: { label: "Display Name" },
    specialUseType: { label: "Type" },
    messageCount: { label: "Messages" },
    unseenCount: { label: "Unseen" },
  },

  errors: {
    validation: { title: "Validation Error", description: "Check your input" },
    unauthorized: { title: "Unauthorized", description: "Login required" },
    server: { title: "Server Error", description: "Internal server error" },
    unknown: { title: "Unknown Error", description: "Unexpected error" },
    forbidden: { title: "Forbidden", description: "Access denied" },
    network: { title: "Network Error", description: "Network error" },
    notFound: {
      title: "Account Not Found",
      description: "Messenger account not found",
    },
    conflict: {
      title: "Conflict",
      description: "Request conflicts with existing data",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
  },

  success: {
    title: "Folders Loaded",
    description: "Folders retrieved successfully",
  },
};
