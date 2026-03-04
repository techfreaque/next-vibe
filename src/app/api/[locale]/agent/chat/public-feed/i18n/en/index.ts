export const translations = {
  tags: {
    publicFeed: "Public Feed",
  },
  get: {
    title: "Community Feed",
    description: "Public threads shared with the community",
    sortMode: {
      label: "Sort Mode",
      description: "How to sort the feed (hot, new, rising)",
    },
    page: {
      label: "Page",
      description: "Page number to retrieve",
    },
    limit: {
      label: "Limit",
      description: "Number of threads per page",
    },
    search: {
      label: "Search",
      description: "Search threads by title",
    },
    response: {
      title: "Feed Response",
      description: "Enriched public thread list",
      items: {
        item: {
          title: "Feed Item",
          id: { content: "Thread ID" },
          threadTitle: { content: "Title" },
          preview: { content: "Preview" },
          folderId: { content: "Folder ID" },
          folderName: { content: "Category" },
          authorId: { content: "Author ID" },
          authorName: { content: "Author" },
          messageCount: { content: "Messages" },
          authorCount: { content: "Participants" },
          upvotes: { content: "Upvotes" },
          downvotes: { content: "Downvotes" },
          score: { content: "Score" },
          modelNames: { content: "Models Used" },
          isStreaming: { content: "Is Streaming" },
          createdAt: { content: "Created At" },
          updatedAt: { content: "Updated At" },
        },
      },
      totalCount: { content: "Total Count" },
      pageCount: { content: "Page Count" },
      currentPage: { content: "Current Page" },
      pageSize: { content: "Page Size" },
    },
    errors: {
      validationFailed: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view the feed",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view the feed",
      },
      notFound: {
        title: "Not Found",
        description: "No threads found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      networkError: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unknownError: {
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
      description: "Feed retrieved successfully",
    },
  },
  sortMode: {
    hot: "Hot",
    new: "New",
    rising: "Rising",
  },
};
