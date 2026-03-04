export const translations = {
  tags: {
    threads: "Threads",
  },
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
          archived: {
            content: "Archived",
          },
          isStreaming: {
            content: "Streaming",
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
    id: {
      label: "Thread ID",
      description: "Client-generated thread ID",
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
      label: "Default Character",
      description: "Default character for this thread",
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
  widget: {
    common: {
      noChatsFound: "No chats found",
      delete: "Delete",
      cancel: "Cancel",
    },
    actions: {
      rename: "Rename",
      unpin: "Unpin",
      pin: "Pin to Top",
      unarchive: "Unarchive",
      archive: "Archive",
      manageSharing: "Manage Sharing",
      moveToFolder: "Move to Folder",
      unfiled: "Unfiled",
    },
    folderList: {
      managePermissions: "Manage Permissions",
      today: "Today",
      lastWeek: "Last 7 Days",
      lastMonth: "Last 30 Days",
      older: "Older",
    },
    threadList: {
      deleteDialog: {
        title: "Delete Thread",
        description:
          'Are you sure you want to delete "{{title}}"? This action cannot be undone and all messages in this thread will be permanently deleted.',
      },
    },
    suggestedPrompts: {
      title: "How can I help you?",
      privateTitle: "Your Private AI Assistant",
      privateDescription:
        "Conversations saved to your account and synced across all your devices.",
      sharedTitle: "Collaborate with AI",
      sharedDescription:
        "Create conversations and share them with team members using secure links.",
      publicTitle: "Join the Public AI Forum",
      publicDescription:
        "Public conversations visible to everyone. Share ideas and engage in open dialogue.",
      incognitoTitle: "Anonymous AI Chat",
      incognitoDescription:
        "Stored only in your browser. Never saved to your account or synced.",
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "Just now",
      hoursAgo: "{{hours}}h ago",
      daysAgo: "{{days}}d ago",
    },
  },
  config: {
    folders: {
      private: "Private Chats",
      shared: "Shared Chats",
      public: "Public Chats",
      incognito: "Incognito Chats",
      cron: "Cron Threads",
    },
  },
};
