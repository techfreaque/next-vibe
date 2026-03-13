export const translations = {
  title: "List Inbox",
  description: "List messages from the inbox or a specific folder",
  tag: "Inbox",

  container: {
    title: "Inbox Messages",
    description: "Messages from the selected account and folder",
  },

  accountId: {
    label: "Account",
    description: "Messenger account to read inbox from",
    placeholder: "Account UUID",
  },
  folderPath: {
    label: "Folder",
    description: "Folder path to list (defaults to INBOX)",
    placeholder: "INBOX",
  },

  messages: {
    label: "Messages",
    uid: { label: "UID" },
    messageId: { label: "Message ID" },
    subject: { label: "Subject" },
    from: { label: "From" },
    to: { label: "To" },
    date: { label: "Date" },
    isRead: { label: "Read" },
    isFlagged: { label: "Flagged" },
    folderPath: { label: "Folder" },
    bodyText: { label: "Body" },
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
    title: "Inbox Loaded",
    description: "Messages retrieved successfully",
  },
};
