export const translations = {
  title: "Move Message",
  description: "Move a message to a different folder",
  tag: "Inbox",

  container: {
    title: "Move Message",
    description: "Move a message from one folder to another",
  },

  accountId: {
    label: "Account",
    description: "Messenger account",
    placeholder: "Account UUID",
  },
  uid: {
    label: "Message UID",
    description: "The UID of the message to move",
    placeholder: "12345",
  },
  fromFolder: {
    label: "From Folder",
    description: "Current folder path",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "To Folder",
    description: "Destination folder path",
    placeholder: "Archive",
  },

  moved: { label: "Moved" },

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
    title: "Message Moved",
    description: "The message has been moved successfully",
  },
};
