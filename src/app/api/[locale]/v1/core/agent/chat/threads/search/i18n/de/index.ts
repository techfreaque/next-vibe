/**
 * Thread Search API - German Translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  search: {
    get: {
      title: "Search Threads",
      description:
        "Search across thread titles, previews, and system prompts using full-text search",
      container: {
        title: "Thread Search",
        description: "Search for threads with relevance ranking",
      },
      query: {
        label: "Search Query",
        description:
          "Enter search terms. Supports phrases in quotes, AND/OR operators",
        placeholder: "Search threads...",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Control result pagination",
        },
      },
      page: {
        label: "Page",
        description: "Page number (1-based)",
      },
      limit: {
        label: "Results per Page",
        description: "Number of results per page (1-100)",
      },
      sortBy: {
        label: "Sort By",
        description: "Sort results by relevance or date",
        options: {
          relevance: "Relevance",
          date: "Date (newest first)",
        },
      },
      includeArchived: {
        label: "Include Archived",
        description: "Include archived threads in search results",
      },
      response: {
        results: {
          title: "Search Results",
          description: "Threads matching your search query",
          thread: {
            id: {
              label: "Thread ID",
            },
            title: {
              label: "Title",
            },
            preview: {
              label: "Preview",
            },
            rank: {
              label: "Relevance Score",
              description: "Higher scores indicate better matches",
            },
            headline: {
              label: "Snippet",
              description: "Highlighted excerpt showing matched terms",
            },
            status: {
              label: "Status",
            },
            createdAt: {
              label: "Created At",
            },
            updatedAt: {
              label: "Updated At",
            },
          },
        },
        totalResults: {
          label: "Total Results",
          description: "Total number of threads matching the search query",
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
          description: "You must be logged in to search threads",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to search threads",
        },
        notFound: {
          title: "Not Found",
          description: "No threads found",
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
        description: "Search completed successfully",
      },
    },
  },
} as const;
