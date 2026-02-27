export const translations = {
  category: "Chat",
  tags: {
    memories: "Memories",
  },

  patch: {
    title: "Update Memory",
    description:
      "Update an existing memory. All fields are optional — omit any field to keep its current value. To update only tags or priority, simply omit content. IMPORTANT: never pass an empty string for content — it will be ignored and the existing content preserved. To remove a memory entirely, use the delete endpoint instead.",
    container: {
      title: "Update Memory",
      description: "Modify an existing memory",
    },
    id: {
      label: "Memory ID",
      description: "The unique identifier of the memory to update",
    },
    content: {
      label: "Memory Content",
      description:
        "The updated fact to store. Optional — omit or leave undefined to keep the current content. Empty strings are ignored (content is never overwritten with blank).",
    },
    tags: {
      memories: "Memories",
      label: "Tags",
      description: "Tags for categorization (leave empty to keep current)",
    },
    priority: {
      label: "Priority",
      description:
        "Higher priority memories appear first (leave empty to keep current)",
    },
    isPublic: {
      label: "Public",
      description: "Make this memory visible in public and shared contexts",
    },
    isArchived: {
      label: "Archived",
      description:
        "Archive this memory to exclude it from AI context without deleting it",
    },
    backButton: {
      label: "Back",
    },
    submitButton: {
      label: "Update Memory",
    },
    deleteButton: {
      label: "Delete Memory",
    },
    response: {
      success: {
        content: "Updated successfully",
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
        description: "You must be logged in to update memories",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this memory",
      },
      notFound: {
        title: "Not Found",
        description: "Memory not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the memory",
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
        description: "A conflict occurred while updating the memory",
      },
    },
    success: {
      title: "Success",
      description: "Memory updated successfully",
    },
  },
  delete: {
    title: "Delete Memory",
    description: "Removes a memory by ID",
    container: {
      title: "Delete Memory",
      description: "Remove this memory permanently",
    },
    id: {
      label: "Memory ID",
      description: "The unique identifier of the memory to delete",
    },
    backButton: {
      label: "Back",
    },
    deleteButton: {
      label: "Delete",
    },
    response: {
      success: {
        content: "Deleted successfully",
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
        description: "You must be logged in to delete memories",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this memory",
      },
      notFound: {
        title: "Not Found",
        description: "Memory not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the memory",
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
        description: "A conflict occurred while deleting the memory",
      },
    },
    success: {
      title: "Success",
      description: "Memory deleted successfully",
    },
  },
};
