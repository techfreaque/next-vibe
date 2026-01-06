export const translations = {
  get: {
    title: "Get Character",
    description: "Retrieve a specific character by ID",
    container: {
      title: "Character Details",
      description: "Details of the requested character",
    },
    id: {
      label: "Character ID",
      description: "The unique identifier of the character",
    },
    response: {
      character: {
        title: "Character",
        id: { content: "Character ID" },
        name: { content: "Character Name" },
        description: { content: "Character Description" },
        icon: { content: "Character Icon" },
        systemPrompt: { content: "System Prompt" },
        category: { content: "Category" },
        source: { content: "Source" },
        preferredModel: { content: "Preferred Model" },
        voice: { content: "Voice" },
        suggestedPrompts: { content: "Suggested Prompts" },
        modelSelection: { title: "Model Selection" },
        selectionType: { content: "Selection Type" },
        minIntelligence: { content: "Minimum Intelligence" },
        maxIntelligence: { content: "Maximum Intelligence" },
        minPrice: { content: "Minimum Price" },
        maxPrice: { content: "Maximum Price" },
        minContent: { content: "Minimum Content Level" },
        maxContent: { content: "Maximum Content Level" },
        minSpeed: { content: "Minimum Speed" },
        maxSpeed: { content: "Maximum Speed" },
        preferredStrengths: { content: "Preferred Strengths" },
        ignoredWeaknesses: { content: "Ignored Weaknesses" },
        manualModelId: { content: "Manual Model" },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to access this resource",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Character Not Found",
        description: "The requested character does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving the character",
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
      description: "Character retrieved successfully",
    },
  },
  patch: {
    title: "Update Character",
    container: {
      title: "Update Character",
      description: "Modify an existing custom character",
    },
    actions: {
      update: "Update Character",
      updating: "Updating Character",
    },
    response: {
      success: {
        content: "Character updated successfully",
      },
    },
    id: {
      label: "Character ID",
      description: "The unique identifier of the character to update",
    },
    name: {
      label: "Name",
      description: "The name of the character",
    },
    description: {
      label: "Description",
      description: "A brief description of the character",
    },
    icon: {
      label: "Icon",
      description: "An emoji icon for the character",
    },
    systemPrompt: {
      label: "System Prompt",
      description: "The system prompt that defines the character's behavior",
    },
    category: {
      label: "Category",
      description: "The category this character belongs to",
    },
    preferredModel: {
      label: "Preferred Model",
      description: "The preferred AI model for this character",
    },
    suggestedPrompts: {
      label: "Suggested Prompts",
      description: "Example prompts to use with this character",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The character data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update characters",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this character",
      },
      notFound: {
        title: "Character Not Found",
        description: "The character you're trying to update does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the character",
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
        description: "A conflict occurred while updating the character",
      },
    },
    success: {
      title: "Character Updated",
      description: "Your custom character has been updated successfully",
    },
  },
  delete: {
    title: "Delete Character",
    description: "Delete a custom character",
    container: {
      title: "Delete Character",
      description: "Permanently remove this custom character",
    },
    id: {
      label: "Character ID",
      description: "The unique identifier of the character to delete",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to delete this character",
      },
      notFound: {
        title: "Character Not Found",
        description: "The character you are trying to delete does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the character",
      },
    },
    success: {
      title: "Character Deleted",
      description: "The character has been successfully deleted",
    },
  },
};
