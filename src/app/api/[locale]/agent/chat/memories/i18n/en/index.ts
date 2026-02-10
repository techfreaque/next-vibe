import { translations as idTranslations } from "../../[id]/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";

export const translations = {
  create: createTranslations,
  id: idTranslations,
  tags: {
    memories: "Memories",
  },
  category: "Chat",
  searchPlaceholder: "Search memories by content or tags...",
  showing: "Showing {{count}} of {{total}} memories",
  stats: {
    total: "Total",
    highPriority: "High Priority",
    avgPriority: "Avg Priority",
    size: "Size",
  },
  get: {
    title: "List Memories",
    description: "Retrieves all memories for the current user",
    container: {
      title: "Memories",
    },
    createButton: {
      label: "Create Memory",
    },
    stats: {
      title: "Overview",
    },
    emptyState: "No memories yet. Create your first memory to get started.",
    emptySearch: "No memories found matching your search.",
    columns: {
      memoryNumber: "#",
      content: "Content",
      priority: "Priority",
      tags: "Tags",
      createdAt: "Created",
    },
    response: {
      memories: {
        memory: {
          title: "Memory",
          memoryNumber: { text: "#" },
          content: { content: "Content" },
          tags: { content: "Tags" },
          priority: { text: "Priority" },
          createdAt: { content: "Created At" },
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Failed",
        description: "The request data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view memories",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An unexpected error occurred",
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
      description: "Memories retrieved successfully",
    },
  },
};
