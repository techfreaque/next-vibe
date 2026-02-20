export const translations = {
  // Shared translation keys
  tag: "IMAP Message",

  // GET endpoint translations
  get: {
    title: "Get IMAP Message",
    description: "Retrieve IMAP message details by ID",
    container: {
      title: "Message Details",
      description: "Individual IMAP message information",
    },
    id: {
      label: "Message ID",
      description: "Unique identifier for the IMAP message",
      placeholder: "Enter message UUID",
    },
    response: {
      title: "Message Response",
      description: "IMAP message details and metadata",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid message ID or request parameters",
      },
      notFound: {
        title: "Message Not Found",
        description: "The requested IMAP message could not be found",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access IMAP messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this IMAP message",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while retrieving message",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while retrieving message",
      },
      conflict: {
        title: "Conflict Error",
        description: "Message retrieval conflicts with existing data",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while retrieving message",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
    },
    success: {
      title: "Message Retrieved",
      description: "IMAP message retrieved successfully",
    },
  },

  // PATCH endpoint translations
  patch: {
    title: "Update IMAP Message",
    description: "Update IMAP message properties (read status, flags, etc.)",
    container: {
      title: "Update Message",
      description: "Modify IMAP message properties",
    },
    id: {
      label: "Message ID",
      description: "Unique identifier for the IMAP message to update",
      placeholder: "Enter message UUID",
    },
    isRead: {
      label: "Read Status",
      description: "Mark message as read or unread",
    },
    isFlagged: {
      label: "Flagged Status",
      description: "Mark message as flagged or unflagged",
    },
    subject: {
      label: "Subject",
      description: "Update the message subject line",
      placeholder: "Enter message subject",
    },
    response: {
      title: "Updated Message",
      description: "Updated IMAP message details",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid update parameters or message ID",
      },
      notFound: {
        title: "Message Not Found",
        description: "The IMAP message to update could not be found",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to update IMAP messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this IMAP message",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while updating message",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while updating message",
      },
      conflict: {
        title: "Conflict Error",
        description: "Message update conflicts with existing data",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while updating message",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
    },
    success: {
      title: "Message Updated",
      description: "IMAP message updated successfully",
    },
  },

  // Legacy POST endpoint translations (keeping for compatibility)
  post: {
    title: "[id]",
    description: "[id] endpoint",
    form: {
      title: "[id] Configuration",
      description: "Configure [id] parameters",
    },
    response: {
      title: "Response",
      description: "[id] response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  widget: {
    title: "IMAP Message",
    notFound: "Message not found",
    parties: "Parties",
    from: "From",
    to: "To",
    timestamps: "Timestamps",
    sentAt: "Sent At",
    receivedAt: "Received At",
    sent: "Sent",
    received: "Received",
    flagged: "Flagged",
    unread: "Unread",
    hasAttachments: "Has Attachments",
    attachments: "attachments",
    body: "Message Body",
    noBody: "No message body",
    flag: "Flag",
    unflag: "Unflag",
    markRead: "Mark as Read",
    markUnread: "Mark as Unread",
    thread: "Conversation",
    threadMessages: "messages in this conversation",
    threadExpand: "Show",
    threadCollapse: "Hide",
  },
};
