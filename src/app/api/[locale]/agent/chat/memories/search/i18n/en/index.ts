export const translations = {
  category: "Chat",
  tags: {
    memories: "Memories",
  },

  search: {
    get: {
      title: "Search Memories",
      dynamicTitle: "Memory Search: {{query}}",
      dynamicTitleWithCount: "Memory Search: {{query}} ({{count}})",
      description:
        "Search through memories by content text. Returns matching memories with content snippets. Supports filtering by tags and including archived memories.",
      container: {
        title: "Search Memories",
        description: "Find memories by content or tags",
      },
      query: {
        label: "Search Query",
        description: "Text to search for in memory content (case-insensitive)",
      },
      includeArchived: {
        label: "Include Archived",
        description:
          "Include archived memories in search results (default: false)",
      },
      tags: {
        label: "Filter by Tags",
        description:
          "Only return memories that have at least one of these tags",
      },
      response: {
        results: {
          memory: {
            title: "Memory",
            memoryNumber: { text: "#" },
            content: { content: "Content" },
            tags: { content: "Tags" },
            priority: { text: "Priority" },
            isArchived: { text: "Archived" },
            createdAt: { content: "Created At" },
          },
        },
        total: { content: "Total Results" },
      },
      errors: {
        validationFailed: {
          title: "Validation Failed",
          description: "The search query is invalid",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to search memories",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to search memories",
        },
        notFound: {
          title: "Not Found",
          description: "The requested resource was not found",
        },
        serverError: {
          title: "Server Error",
          description: "An error occurred while searching memories",
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
          description: "A conflict occurred with the current state",
        },
      },
      success: {
        title: "Success",
        description: "Memory search completed successfully",
      },
    },
  },
};
