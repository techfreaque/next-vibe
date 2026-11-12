export const translations = {
  tags: {
    threads: "Threads",
  },
  enums: {
    threadStatus: {
      active: "Active",
      archived: "Archived",
      deleted: "Deleted",
    },
  },
  errors: {
    count_failed: "Failed to get conversation count: {{error}}",
  },
  get: {
    title: "Threads",
    titleShort: "Threads",
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
          streamingState: {
            content: "Streaming State",
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
        detail: "Server Error: {{error}}",
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
    title: "New Thread",
    titleShort: "New Thread",
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
      label: "Default Skill",
      description: "Default skill for this thread",
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
        cannotCreateHere: "You can't create a thread in this location",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
        folderNotFound: "Folder not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
        detail: "Server Error: {{error}}",
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
      menu: "Thread actions",
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
      starters: {
        explain: {
          label: "Explain it simply",
          prompt:
            "Explain how inflation works like I'm 12. Short and concrete.",
        },
        search: {
          label: "Search the web",
          prompt:
            "What were the biggest tech stories this week? Search and give me sources.",
        },
        image: {
          label: "Make an image",
          prompt:
            "Generate an image of a cozy cabin in a snowstorm at night, warm light in the windows.",
        },
        honest: {
          label: "Get the honest take",
          prompt:
            "Give me the strongest case for and against crypto. No hedging, no disclaimers.",
        },
      },
      takeTour: "Take the 1-minute tour",
      backgroundTitle: "Your AI Agents Are Working",
      backgroundDescription:
        "Sub-agents and autonomous background agents run tasks here while you focus elsewhere. Results drop in automatically.",
    },
    emptyState: {
      changeCompanion: "Change companion or model. Now: {{name}}",
      folder: {
        private: { label: "Private", note: "Synced to your account." },
        incognito: {
          label: "Incognito",
          note: "Only in this browser. Never synced.",
        },
        shared: { label: "Shared", note: "Anyone with the link can read." },
        public: { label: "Public", note: "Visible to everyone." },
        cron: { label: "Background", note: "Agents work here on their own." },
        remote: { label: "Remote", note: "Runs on your connected instance." },
      },
      use: {
        everyday: {
          good: "Research, writing and daily tasks",
          weak: "Plays it safe on politics",
        },
        politics: {
          good: "Straight answers on politics and taboo topics",
          weak: "Text only, less sharp on complex tasks",
        },
        security: {
          good: "Offensive and defensive security work",
          weak: "Plays it safe on politics",
        },
        writing: {
          good: "Careful writing, code and analysis",
          weak: "Hedges or refuses on edgy topics",
        },
        images: {
          good: "Reads screenshots, photos and video",
          weak: "Careful on edgy topics",
        },
        classic: {
          good: "Reliable all-rounder for code and planning",
          weak: "Careful on edgy topics",
        },
        bold: {
          good: "Blunt, opinionated answers",
          weak: "Not the pick for politics",
        },
        general: {
          good: "General questions",
          weak: "Not the pick for politics",
        },
      },
      mode: {
        autoModel: "Picked automatically",
        goodAt: "Good at:",
        weakAt: "Weak at:",
      },
      spotlight: {
        title: "Pick how {{name}} works.",
        subtitle: "Each mode runs a different model. Or just type to start.",
        now: "Current mode",
        runsOn: "Runs on",
        allModes: "All modes",
        more: "More modes",
        fix: {
          politics: "Politics? Switch to {{mode}}",
          complex: "Complex task? Switch to {{mode}}",
        },
      },
      single: {
        title: "{{name}} runs one model.",
        action: "Switch to {{companion}} for more modes",
      },
      companion: {
        title: "Who should answer?",
        subtitle:
          "Each companion has its own personality and a set of models for different jobs.",
        skip: "Or just type to start without a companion.",
        skipModel: "Or just type. {{model}} answers, no persona.",
        about: {
          thea: "Warm and thoughtful. Talks it through.",
          hermes: "Direct and fast. Gets the job done.",
        },
      },
      custom: {
        title: "Your custom skill is ready.",
        subtitle:
          "Switch skill or model from the selector under the message box.",
      },
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
      background: "Background Threads",
      remote: "Remote Chats",
    },
  },
};
