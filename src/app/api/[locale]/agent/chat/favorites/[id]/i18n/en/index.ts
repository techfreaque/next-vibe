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
      modelSelection: {
        title: "Model Selection",
      },
      selectionType: {
        content: "Selection Type: {{value}}",
      },
      minIntelligence: {
        content: "Min Intelligence: {{value}}",
      },
      maxIntelligence: {
        content: "Max Intelligence: {{value}}",
      },
      minPrice: {
        content: "Min Price: {{value}}",
      },
      maxPrice: {
        content: "Max Price: {{value}}",
      },
      minContent: {
        content: "Min Content Level: {{value}}",
      },
      maxContent: {
        content: "Max Content Level: {{value}}",
      },
      minSpeed: {
        content: "Min Speed: {{value}}",
      },
      maxSpeed: {
        content: "Max Speed: {{value}}",
      },
      content: {
        content: "Content Level: {{value}}",
      },
      preferredStrengths: {
        content: "Preferred Strengths: {{value}}",
      },
      ignoredWeaknesses: {
        content: "Ignored Weaknesses: {{value}}",
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
    modelSelection: {
      title: "Model Selection",
      description:
        "Choose how to select the AI model - either pick a specific model or let the system choose based on filters",
    },
    selectionType: {
      label: "Selection Type",
      manual: "Specific Model",
      filters: "Filter Criteria",
    },
    intelligence: {
      label: "Intelligence Level",
    },
    minIntelligence: {
      label: "Minimum Intelligence",
      description:
        "Minimum intelligence/capability level required for the model",
    },
    maxIntelligence: {
      label: "Maximum Intelligence",
      description:
        "Maximum intelligence/capability level allowed for the model",
    },
    minPrice: {
      label: "Minimum Price",
      description: "Minimum credit cost per message",
    },
    maxPrice: {
      label: "Max Price",
    },
    minContent: {
      label: "Minimum Content Level",
      description: "Minimum content moderation level for the model",
    },
    maxContent: {
      label: "Maximum Content Level",
      description: "Maximum content moderation level for the model",
    },
    minSpeed: {
      label: "Minimum Speed",
      description: "Minimum speed level required for the model",
    },
    maxSpeed: {
      label: "Maximum Speed",
      description: "Maximum speed level allowed for the model",
    },
    content: {
      label: "Content Level",
    },
    preferredStrengths: {
      label: "Preferred Strengths",
      description: "Model capabilities and strengths to prefer",
    },
    ignoredWeaknesses: {
      label: "Ignored Weaknesses",
      description: "Model weaknesses to ignore or allow",
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
    color: {
      label: "Color",
      description: "Custom color for this favorite",
    },
    customIcon: {
      label: "Custom Icon",
      description: "Custom icon for this favorite",
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
