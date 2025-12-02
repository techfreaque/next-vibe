import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  id: idTranslations,
  tags: {
    memories: "Memories",
  },
  category: "Chat",
  get: {
    title: "List Memories",
    description: "Retrieves all memories for the current user",
    container: {
      title: "Memory List",
      description: "View all stored memories",
    },
    response: {
      memories: {
        memory: {
          title: "Memory",
          id: { content: "Memory ID" },
          content: { content: "Content" },
          tags: { content: "Tags" },
          sequenceNumber: { content: "Sequence Number" },
          priority: { content: "Priority" },
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
  post: {
    title: "Add Memory",
    description: "Creates a new memory for the current user",
    container: {
      title: "Add Memory",
      description: "Store a new fact or preference",
    },
    content: {
      label: "Memory Content",
      description:
        "The fact to remember (e.g., 'Profession: Software engineer')",
    },
    tags: {
      label: "Tags",
      description: "Tags for categorization (e.g., profession, preferences)",
    },
    priority: {
      label: "Priority",
      description: "Higher priority memories appear first (0-100)",
    },
    response: {
      id: { content: "Memory ID" },
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
        description: "You must be logged in to add memories",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to add memories",
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
      description: "Memory added successfully",
    },
  },
};
