import { translations as messageIdTranslations } from "../../[messageId]/i18n/en";
import pathTranslations from "../../path/i18n/en";
import { translations as searchTranslations } from "../../search/i18n/en";

export const translations = {
  ...searchTranslations,
  get: {
    title: "List Thread Messages",
    description: "Retrieve all messages in a chat thread",
    container: {
      title: "Messages",
      description: "Thread message list",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to retrieve messages from",
    },
    response: {
      title: "Messages Response",
      description: "List of messages in the thread",
      messages: {
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
          persona: {
            content: "Persona",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "Sequence ID",
          },

          toolCalls: {
            content: "Tool Calls",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
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
        description: "You don't have permission to view these messages",
        incognitoNotAllowed:
          "Incognito threads cannot be accessed on the server",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
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
    },
    success: {
      title: "Success",
      description: "Messages retrieved successfully",
    },
  },
  post: {
    title: "Create Message",
    description: "Create a new message in a chat thread",
    form: {
      title: "New Message",
      description: "Create a message in the thread",
    },
    sections: {
      message: {
        title: "Message Details",
        description: "Message content and settings",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to add message to",
    },
    content: {
      label: "Content",
      description: "Message content",
      placeholder: "Enter message content...",
    },
    role: {
      label: "Role",
      description: "Message role (user, assistant, system)",
    },
    parentId: {
      label: "Parent Message",
      description: "Parent message ID for branching",
    },
    model: {
      label: "Model",
      description: "AI model to use for response",
    },
    response: {
      title: "Created Message",
      description: "Newly created message details",
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
        description: "You must be logged in to create messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create messages",
        incognitoNotAllowed:
          "Incognito threads cannot be accessed on the server",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
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
      createFailed: {
        title: "Failed to create message",
        description: "An error occurred while creating the message",
      },
    },
    success: {
      title: "Success",
      description: "Message created successfully",
    },
  },
  messageId: messageIdTranslations,
  path: pathTranslations,
};
