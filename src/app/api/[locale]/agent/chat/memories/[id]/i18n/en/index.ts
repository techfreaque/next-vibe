export const translations = {
  patch: {
    title: "Update Memory",
    description: "Updates an existing memory by ID",
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
      description: "The fact to remember (leave empty to keep current)",
    },
    tags: {
      label: "Tags",
      description: "Tags for categorization (leave empty to keep current)",
    },
    priority: {
      label: "Priority",
      description: "Higher priority memories appear first (leave empty to keep current)",
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
      description: "Remove a memory permanently",
    },
    id: {
      label: "Memory ID",
      description: "The unique identifier of the memory to delete",
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
