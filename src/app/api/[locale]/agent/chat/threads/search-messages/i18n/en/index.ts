export const translations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  search: {
    get: {
      title: "Global Message Search",
      description: "Search messages across all threads using full-text search",
      container: {
        title: "Global Message Search",
        description: "Search for messages across all your threads",
      },
      query: {
        label: "Search Query",
        description: "Text to search for in messages",
      },
      sections: {
        filters: {
          title: "Filters",
          description: "Optional filters to narrow search results",
        },
        pagination: {
          title: "Pagination",
          description: "Page navigation settings",
        },
      },
      rootFolderId: {
        label: "Root Folder",
        description:
          "Limit search to a specific root folder type (private, shared, public, cron)",
      },
      role: {
        label: "Message Role",
        description:
          "Filter by message role (user, assistant, system, tool, error)",
      },
      startDate: {
        label: "Start Date",
        description: "Only include messages created after this date",
      },
      endDate: {
        label: "End Date",
        description: "Only include messages created before this date",
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
            title: "Message Result",
            messageId: {
              content: "Message ID",
            },
            threadId: {
              content: "Thread ID",
            },
            threadTitle: {
              content: "Thread Title",
            },
            role: {
              content: "Role",
            },
            headline: {
              content: "Content Snippet",
            },
            createdAt: {
              content: "Created At",
            },
            rootFolderId: {
              content: "Root Folder",
            },
          },
        },
        total: {
          content: "Total Results",
        },
        page: {
          content: "Current Page",
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
          description: "You don't have permission to perform this search",
        },
        notFound: {
          title: "Not Found",
          description: "No results found matching your query",
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
        description: "Global message search completed successfully",
      },
    },
  },
};
