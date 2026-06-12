export const translations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  get: {
    title: "Get Message",
    titleShort: "Message",
    description: "Retrieve a specific message by ID",
    container: {
      title: "Message Details",
      description: "View message information",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread containing the message",
    },
    messageId: {
      label: "Message ID",
      description: "ID of the message to retrieve",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder of the thread (used for client routing)",
    },
    response: {
      title: "Message Response",
      description: "Message details",
      message: {
        title: "Message",
        id: {
          content: "Message ID",
        },
        threadId: {
          content: "Thread ID",
        },
        role: {
          content: "Role",
        },
        content: {
          content: "Content",
        },
        parentId: {
          content: "Parent Message ID",
        },
        authorId: {
          content: "Author ID",
        },
        isAI: {
          content: "Is AI",
        },
        model: {
          content: "Model",
        },
        tokens: {
          content: "Tokens",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view this message",
      },
      notFound: {
        title: "Not Found",
        description: "Message not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      threadNotFound: {
        title: "Thread Not Found",
        description: "The specified thread does not exist",
      },
      messageNotFound: {
        title: "Message Not Found",
        description: "The specified message does not exist",
      },
    },
    backButton: {
      label: "Back",
    },
    success: {
      title: "Success",
      description: "Message retrieved successfully",
    },
  },
  patch: {
    title: "Update Message",
    titleShort: "Update Message",
    description: "Update a message's content",
    container: {
      title: "Edit Message",
      description: "Update message content",
    },
    form: {
      title: "Edit Message",
      description: "Update message content",
    },
    sections: {
      message: {
        title: "Message Content",
        description: "Edit the message",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread containing the message",
    },
    messageId: {
      label: "Message ID",
      description: "ID of the message to update",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder of the thread (used for client routing)",
    },
    content: {
      label: "Content",
      description: "Updated message content",
      placeholder: "Enter message content...",
    },
    role: {
      label: "Role",
      description: "Message role (user, assistant, system)",
    },
    response: {
      title: "Updated Message",
      description: "Updated message details",
      message: {
        title: "Message",
        id: {
          content: "Message ID",
        },
        threadId: {
          content: "Thread ID",
        },
        role: {
          content: "Role",
        },
        content: {
          content: "Content",
        },
        parentId: {
          content: "Parent Message ID",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid message data provided",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this message",
      },
      notFound: {
        title: "Not Found",
        description: "Message not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      threadNotFound: {
        title: "Thread Not Found",
        description: "The specified thread does not exist",
      },
      messageNotFound: {
        title: "Message Not Found",
        description: "The specified message does not exist",
      },
    },
    backButton: {
      label: "Back",
    },
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving…",
    },
    success: {
      title: "Success",
      description: "Message updated successfully",
    },
  },
  delete: {
    title: "Delete Message",
    titleShort: "Delete Message",
    description: "Delete a message from the thread",
    container: {
      title: "Delete Message",
      description: "Remove message from thread",
    },
    confirmTitle: "Delete message",
    confirmText:
      "Are you sure you want to delete this message? This action cannot be undone.",
    backButton: {
      label: "Cancel",
    },
    submitButton: {
      label: "Delete",
      loadingText: "Deleting…",
    },
    deleteButton: {
      label: "Delete",
      loadingText: "Deleting…",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread containing the message",
    },
    messageId: {
      label: "Message ID",
      description: "ID of the message to delete",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder of the thread (used for client routing)",
    },
    response: {
      success: { content: "Success" },
      role: { content: "Role" },
      content: { content: "Content" },
      parentId: { content: "Parent Message ID" },
      authorId: { content: "Author ID" },
      isAI: { content: "Is AI" },
      model: { content: "Model" },
      createdAt: { content: "Created At" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to delete messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this message",
      },
      notFound: {
        title: "Not Found",
        description: "Message not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Cannot delete message with child messages",
      },
      threadNotFound: {
        title: "Thread Not Found",
        description: "The specified thread does not exist",
      },
      messageNotFound: {
        title: "Message Not Found",
        description: "The specified message does not exist",
      },
    },
    success: {
      title: "Success",
      description: "Message deleted successfully",
    },
  },
  vote: {
    category: "Chat",
    tags: {
      messages: "Messages",
    },
    post: {
      title: "Vote on Message",
      description: "Upvote or downvote a message",
      container: {
        title: "Vote",
        description: "Cast your vote on this message",
      },
      form: {
        title: "Vote on Message",
        description: "Upvote, downvote, or remove your vote",
      },
      threadId: {
        label: "Thread ID",
        description: "ID of the thread containing the message",
      },
      messageId: {
        label: "Message ID",
        description: "ID of the message to vote on",
      },
      rootFolderId: {
        label: "Root Folder",
        description: "Root folder of the thread (used for client routing)",
      },
      vote: {
        label: "Vote",
        description: "Your vote: upvote, downvote, or remove",
        placeholder: "Select vote type...",
        options: {
          upvote: "Upvote",
          downvote: "Downvote",
          remove: "Remove Vote",
        },
      },
      response: {
        title: "Vote Result",
        description: "Updated vote counts",
        upvotes: {
          content: "Upvotes",
        },
        downvotes: {
          content: "Downvotes",
        },
        userVote: {
          content: "Your Vote",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid vote data provided",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to vote on messages",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to vote on this message",
          incognitoNotAllowed:
            "Incognito threads cannot be accessed on the server",
        },
        notFound: {
          title: "Not Found",
          description: "Message not found",
        },
        server: {
          title: "Server Error",
          description: "Failed to record vote",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "Vote conflict occurred",
        },
      },
      success: {
        title: "Vote Recorded",
        description: "Your vote has been recorded successfully",
      },
    },
  },
};
