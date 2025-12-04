import { translations as threadsThreadIdTranslations } from "../../[threadId]/i18n/en";
import { translations as searchTranslations } from "../../search/i18n/en";

export const translations = {
  ...searchTranslations,
  errors: {
    count_failed: "Failed to get conversation count: {{error}}",
  },
  get: {
    title: "List Chat Threads",
    description:
      "Retrieve a paginated list of chat threads with filtering options",
    container: {
      title: "Thread List",
      description: "Browse and filter chat threads",
    },
    sections: {
      pagination: {
        title: "Pagination",
        description: "Page navigation settings",
      },
      filters: {
        title: "Filters",
        description: "Filter threads by criteria",
      },
    },
    page: {
      label: "Page",
      description: "Page number to retrieve",
    },
    limit: {
      label: "Limit",
      description: "Number of threads per page",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Filter by root folder (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Subfolder",
      description: "Filter by subfolder ID (optional)",
    },
    status: {
      label: "Status",
      description: "Filter by thread status",
    },
    search: {
      label: "Search",
      description: "Search threads by title or content",
      placeholder: "Search threads...",
    },
    isPinned: {
      label: "Pinned Only",
      description: "Filter to show only pinned threads",
    },
    dateFrom: {
      label: "Date From",
      description: "Filter threads created after this date",
    },
    dateTo: {
      label: "Date To",
      description: "Filter threads created before this date",
    },
    response: {
      title: "Thread List Response",
      description: "Paginated list of threads",
      threads: {
        thread: {
          title: "Thread",
          id: {
            content: "Thread ID",
          },
          threadTitle: {
            content: "Title",
          },
          rootFolderId: {
            content: "Root Folder",
          },
          folderId: {
            content: "Subfolder ID",
          },
          status: {
            content: "Status",
          },
          preview: {
            content: "Preview",
          },
          pinned: {
            content: "Pinned",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
          canEdit: {
            content: "Can Edit",
          },
          canPost: {
            content: "Can Post",
          },
          canModerate: {
            content: "Can Moderate",
          },
          canDelete: {
            content: "Can Delete",
          },
          canManagePermissions: {
            content: "Can Manage Permissions",
          },
        },
      },
      totalCount: {
        content: "Total Count",
      },
      pageCount: {
        content: "Page Count",
      },
      page: {
        content: "Current Page",
      },
      limit: {
        content: "Items Per Page",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view threads",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view threads",
      },
      notFound: {
        title: "Not Found",
        description: "No threads found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
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
      description: "Threads retrieved successfully",
    },
  },
  post: {
    title: "Create Chat Thread",
    description: "Create a new chat thread",
    form: {
      title: "Create Thread",
      description: "Configure new thread settings",
    },
    sections: {
      thread: {
        title: "Thread Details",
        description: "Basic thread information",
      },
    },
    threadTitle: {
      label: "Title",
      description: "Thread title",
      placeholder: "Enter thread title...",
      default: "New Chat",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Subfolder",
      description: "Subfolder to place thread in (optional)",
    },
    defaultModel: {
      label: "Default Model",
      description: "Default AI model for this thread",
    },
    defaultTone: {
      label: "Default Persona",
      description: "Default persona for this thread",
    },
    systemPrompt: {
      label: "System Prompt",
      description: "Custom system prompt for this thread",
      placeholder: "Enter system prompt...",
    },
    response: {
      title: "Created Thread",
      description: "Newly created thread details",
      thread: {
        title: "Thread",
        id: {
          content: "Thread ID",
        },
        threadTitle: {
          content: "Title",
        },
        rootFolderId: {
          content: "Root Folder",
        },
        subFolderId: {
          content: "Subfolder ID",
        },
        status: {
          content: "Status",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
        canEdit: {
          content: "Can Edit",
        },
        canPost: {
          content: "Can Post",
        },
        canModerate: {
          content: "Can Moderate",
        },
        canDelete: {
          content: "Can Delete",
        },
        canManagePermissions: {
          content: "Can Manage Permissions",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid thread data provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create threads",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create threads",
        incognitoNotAllowed:
          "Incognito threads cannot be created on the server",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
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
        description: "A thread with this name already exists",
      },
    },
    success: {
      title: "Success",
      description: "Thread created successfully",
    },
  },
  threadId: threadsThreadIdTranslations,
};
