import { translations as branchTranslations } from "../../branch/i18n/en";
import { translations as voteTranslations } from "../../vote/i18n/en";

export const translations = {
  get: {
    title: "Get Message",
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
        depth: {
          content: "Depth",
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
    success: {
      title: "Success",
      description: "Message retrieved successfully",
    },
  },
  patch: {
    title: "Update Message",
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
        depth: {
          content: "Depth",
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
    success: {
      title: "Success",
      description: "Message updated successfully",
    },
  },
  delete: {
    title: "Delete Message",
    description: "Delete a message from the thread",
    container: {
      title: "Delete Message",
      description: "Remove message from thread",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread containing the message",
    },
    messageId: {
      label: "Message ID",
      description: "ID of the message to delete",
    },
    response: {
      success: {
        content: "Success",
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
  branch: branchTranslations,
  vote: voteTranslations,
};
