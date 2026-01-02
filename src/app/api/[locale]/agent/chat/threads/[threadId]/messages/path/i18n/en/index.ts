export const translations = {
  get: {
    title: "Get Conversation Path",
    description: "Retrieve messages following a specific conversation path",
    container: {
      title: "Conversation Path",
      description: "Messages in selected conversation branch",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to retrieve path from",
    },
    branchIndices: {
      label: "Branch Indices",
      description: "Map of depth to branch index for selecting conversation path",
    },
    response: {
      title: "Path Messages",
      description: "Messages in the conversation path",
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
        description: "You must be logged in to view conversation paths",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view this conversation path",
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
      threadNotFound: {
        title: "Thread Not Found",
        description: "The specified thread does not exist",
      },
      noRootMessage: {
        title: "No Root Message",
        description: "Thread has no root message",
      },
      getFailed: {
        title: "Get Failed",
        description: "Failed to retrieve conversation path",
      },
    },
    success: {
      title: "Success",
      description: "Conversation path retrieved successfully",
    },
  },
};

export default translations;
