export const translations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
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
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder of the thread (used for client routing)",
    },
    leafMessageId: {
      label: "Leaf Message ID",
      description:
        "ID of the leaf (deepest) message to show path for. Omit for latest.",
    },
    before: {
      label: "Before Message ID",
      description:
        "Load history chunk before this message ID (cursor-based pagination)",
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
          sequenceId: {
            content: "Sequence ID",
          },
          authorId: {
            content: "Author ID",
          },
          authorName: {
            content: "Author Name",
          },
          isAI: {
            content: "Is AI",
          },
          model: {
            content: "Model",
          },
          skill: {
            content: "Skill",
          },
          errorType: {
            content: "Error Type",
          },
          errorMessage: {
            content: "Error Message",
          },
          errorCode: {
            content: "Error Code",
          },
          metadata: {
            content: "Metadata",
          },
          upvotes: {
            content: "Upvotes",
          },
          downvotes: {
            content: "Downvotes",
          },
          searchVector: {
            content: "Search Vector",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
        },
      },
      hasOlderHistory: {
        content: "Has Older History",
      },
      hasNewerMessages: {
        content: "Has Newer Messages",
      },
      resolvedLeafMessageId: {
        content: "Resolved Leaf Message ID",
      },
      oldestLoadedMessageId: {
        content: "Oldest Loaded Message ID",
      },
      compactionBoundaryId: {
        content: "Compaction Boundary ID",
      },
      newerChunkAnchorId: {
        content: "Newer Chunk Anchor ID",
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
