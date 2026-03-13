export const translations = {
  title: "Mark Read",
  description: "Mark a message as read or unread",
  tag: "Inbox",

  container: {
    title: "Mark Message",
    description: "Update the read status of a message",
  },

  accountId: {
    label: "Account",
    description: "Messenger account",
    placeholder: "Account UUID",
  },
  uid: {
    label: "Message UID",
    description: "The UID of the message",
    placeholder: "12345",
  },
  folderPath: {
    label: "Folder",
    description: "Folder path containing the message",
    placeholder: "INBOX",
  },
  isRead: {
    label: "Mark as Read",
    description: "Set to true to mark as read, false to mark as unread",
  },

  updated: { label: "Updated" },

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
    title: "Message Updated",
    description: "Read status updated successfully",
  },
};
