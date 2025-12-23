import { translations as messagesTranslations } from "../../messages/i18n/en";
import { translations as permissionsTranslations } from "../../permissions/i18n/en";

export const translations = {
  messages: messagesTranslations,
  permissions: permissionsTranslations,
  errors: {
    not_implemented_on_native:
      "{{method}} is not implemented on native platform. Please use the web version for this operation.",
  },
  get: {
    title: "Get Chat Thread",
    description: "Retrieve a specific chat thread by ID",
    container: {
      title: "Thread Details",
      description: "View detailed thread information",
    },
    id: {
      label: "Thread ID",
      description: "Unique identifier for the thread",
      placeholder: "Enter thread ID...",
    },
    response: {
      thread: {
        title: "Thread Details",
        description: "Complete thread information",
        id: {
          content: "Thread ID",
        },
        userId: {
          content: "User ID",
        },
        threadTitle: {
          content: "Title",
        },
        folderId: {
          content: "Folder ID",
        },
        status: {
          content: "Status",
        },
        defaultModel: {
          content: "Default Model",
        },
        defaultTone: {
          content: "Default Character",
        },
        systemPrompt: {
          content: "System Prompt",
        },
        pinned: {
          content: "Pinned",
        },
        archived: {
          content: "Archived",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Published",
        },
        preview: {
          content: "Preview",
        },
        metadata: {
          content: "Metadata",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid thread ID provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view threads",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view this thread",
      },
      notFound: {
        title: "Thread Not Found",
        description: "The requested thread could not be found",
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
      description: "Thread retrieved successfully",
    },
  },
  patch: {
    title: "Update Chat Thread",
    description: "Update an existing chat thread",
    container: {
      title: "Update Thread",
      description: "Modify thread settings",
    },
    id: {
      label: "Thread ID",
      description: "Unique identifier for the thread to update",
      placeholder: "Enter thread ID...",
    },
    sections: {
      updates: {
        title: "Thread Updates",
        description: "Fields to update",
      },
    },
    threadTitle: {
      label: "Title",
      description: "Thread title",
      placeholder: "Enter thread title...",
    },
    folderId: {
      label: "Folder",
      description: "Folder to place thread in",
    },
    status: {
      label: "Status",
      description: "Thread status",
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
    },
    pinned: {
      label: "Pinned",
      description: "Pin this thread to the top",
    },
    archived: {
      label: "Archived",
      description: "Archive this thread",
    },
    tags: {
      label: "Tags",
      description: "Tags for organization",
    },
    published: {
      label: "Published",
      description:
        "Make this thread publicly accessible via link (SHARED folders only)",
    },
    response: {
      thread: {
        title: "Updated Thread",
        description: "Thread details after update",
        id: {
          content: "Thread ID",
        },
        userId: {
          content: "User ID",
        },
        threadTitle: {
          content: "Title",
        },
        folderId: {
          content: "Folder ID",
        },
        status: {
          content: "Status",
        },
        defaultModel: {
          content: "Default Model",
        },
        defaultTone: {
          content: "Default Character",
        },
        systemPrompt: {
          content: "System Prompt",
        },
        pinned: {
          content: "Pinned",
        },
        archived: {
          content: "Archived",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Published",
        },
        preview: {
          content: "Preview",
        },
        metadata: {
          content: "Metadata",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
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
        description: "You must be logged in to update threads",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this thread",
      },
      notFound: {
        title: "Thread Not Found",
        description: "The thread to update could not be found",
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
        description: "A conflict occurred while updating",
      },
    },
    success: {
      title: "Success",
      description: "Thread updated successfully",
    },
  },
  delete: {
    title: "Delete Chat Thread",
    description: "Delete a chat thread",
    container: {
      title: "Delete Thread",
      description: "Permanently remove thread",
    },
    id: {
      label: "Thread ID",
      description: "Unique identifier for the thread to delete",
      placeholder: "Enter thread ID...",
      helpText: "WARNING: This action cannot be undone",
    },
    response: {
      success: {
        content: "Deletion Success",
      },
      deletedId: {
        content: "Deleted Thread ID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid thread ID provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to delete threads",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this thread",
      },
      notFound: {
        title: "Thread Not Found",
        description: "The thread to delete could not be found",
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
        description: "Cannot delete thread due to existing dependencies",
      },
    },
    success: {
      title: "Success",
      description: "Thread deleted successfully",
    },
  },
};
