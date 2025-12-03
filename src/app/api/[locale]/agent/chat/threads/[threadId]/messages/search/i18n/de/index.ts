import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  search: {
    get: {
      title: "Search Messages",
      description:
        "Search messages within a specific thread using full-text search",
      container: {
        title: "Message Search",
        description: "Search for messages in this thread",
      },
      threadId: {
        label: "Thread ID",
        description: "The ID of the thread to search in",
      },
      query: {
        label: "Search Query",
        description: "Text to search for in messages",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Page navigation settings",
        },
      },
      page: {
        label: "Page",
        description: "Page number to retrieve",
      },
      limit: {
        label: "Limit",
        description: "Number of results per page",
      },
      response: {
        results: {
          message: {
            title: "Message",
            id: {
              content: "Message ID",
            },
            content: {
              content: "Content",
            },
            role: {
              content: "Role",
            },
            rank: {
              content: "Relevance Score",
            },
            headline: {
              content: "Snippet",
            },
            createdAt: {
              content: "Created At",
            },
          },
        },
        totalCount: {
          content: "Total Results",
        },
      },
      errors: {
        validationFailed: {
          title: "Validation Failed",
          description: "Invalid search parameters provided",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to search messages",
        },
        forbidden: {
          title: "Forbidden",
          description:
            "You don't have permission to search messages in this thread",
        },
        notFound: {
          title: "Thread Not Found",
          description:
            "The specified thread does not exist or you don't have access to it",
        },
        serverError: {
          title: "Server Error",
          description: "An internal server error occurred during search",
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
        description: "Messages search completed successfully",
      },
    },
  },
} as const;
