export const translations = {
  get: {
    title: "Get Favorite",
    description: "Retrieve a specific favorite configuration",
    container: {
      title: "Favorite Details",
    },
    id: {
      label: "Favorite ID",
    },
    response: {
      characterId: {
        content: "Character: {{value}}",
      },
      customName: {
        content: "Custom Name: {{value}}",
      },
      voice: {
        content: "Voice: {{value}}",
      },
      mode: {
        content: "Mode: {{value}}",
      },
      intelligence: {
        content: "Intelligence: {{value}}",
      },
      maxPrice: {
        content: "Max Price: {{value}}",
      },
      content: {
        content: "Content Level: {{value}}",
      },
      manualModelId: {
        content: "Manual Model: {{value}}",
      },
      position: {
        content: "Position: {{value}}",
      },
      color: {
        content: "Color: {{value}}",
      },
      isActive: {
        content: "Active: {{value}}",
      },
      useCount: {
        content: "Times Used: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid favorite ID",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view this favorite",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view this favorite",
      },
      notFound: {
        title: "Not Found",
        description: "Favorite not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to load favorite",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while processing your request",
      },
    },
    success: {
      title: "Success",
      description: "Favorite loaded successfully",
    },
  },
  patch: {
    title: "Update Favorite",
    description: "Update an existing favorite configuration",
    container: {
      title: "Edit Favorite",
    },
    id: {
      label: "Favorite ID",
    },
    characterId: {
      label: "Character",
    },
    customName: {
      label: "Custom Name",
    },
    voice: {
      label: "Voice",
      description: "Text-to-speech voice preference",
    },
    mode: {
      label: "Selection Mode",
    },
    intelligence: {
      label: "Intelligence Level",
    },
    maxPrice: {
      label: "Max Price",
    },
    content: {
      label: "Content Level",
    },
    manualModelId: {
      label: "Manual Model",
    },
    isActive: {
      label: "Active",
    },
    position: {
      label: "Position",
    },
    response: {
      success: {
        content: "Updated: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update this favorite",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this favorite",
      },
      notFound: {
        title: "Not Found",
        description: "Favorite not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to update favorite",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while updating the favorite",
      },
    },
    success: {
      title: "Success",
      description: "Favorite updated successfully",
    },
  },
  delete: {
    title: "Delete Favorite",
    description: "Remove a favorite configuration",
    container: {
      title: "Delete Favorite",
    },
    id: {
      label: "Favorite ID",
    },
    response: {
      success: {
        content: "Deleted: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid favorite ID",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to delete this favorite",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this favorite",
      },
      notFound: {
        title: "Not Found",
        description: "Favorite not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to delete favorite",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "Cannot delete favorite due to a conflict",
      },
    },
    success: {
      title: "Success",
      description: "Favorite deleted successfully",
    },
  },
};
