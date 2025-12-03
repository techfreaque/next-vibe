export const translations = {
  post: {
    title: "Branch Message",
    description: "Create a new branch from this message",
    container: {
      title: "Create Branch",
      description: "Branch conversation from this point",
    },
    form: {
      title: "Branch Message",
      description: "Create alternative conversation path",
    },
    sections: {
      branch: {
        title: "Branch Details",
        description: "New message content",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread containing the message",
    },
    messageId: {
      label: "Message ID",
      description: "ID of the message to branch from",
    },
    content: {
      label: "Content",
      description: "Content for the new branch message",
      placeholder: "Enter message content...",
    },
    role: {
      label: "Role",
      description: "Message role (user, assistant, system)",
    },
    model: {
      label: "Model",
      description: "AI model to use for response",
    },
    response: {
      title: "Branched Message",
      description: "Newly created branch message",
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
        description: "Invalid branch data provided",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to branch messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to branch this message",
      },
      notFound: {
        title: "Not Found",
        description: "Parent message not found",
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
      cannotBranchFromRoot: {
        title: "Cannot Branch From Root",
        description: "Cannot create a branch from the root message",
      },
      createFailed: {
        title: "Create Failed",
        description: "Failed to create branch message",
      },
    },
    success: {
      title: "Success",
      description: "Branch created successfully",
    },
  },
};
