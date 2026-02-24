export const translations = {
  category: "Chat",
  tags: {
    favorites: "Favorites",
  },
  voices: {
    MALE: "Male voice",
    FEMALE: "Female voice",
  },

  get: {
    title: "Get Favorite",
    description: "Retrieve a specific favorite configuration",
    container: {
      title: "Favorite Details",
    },
    editButton: {
      label: "Edit Favorite",
    },
    deleteButton: {
      label: "Delete Favorite",
    },
    customizeCharacterButton: {
      label: "Customize Character's Personality",
    },
    signupPrompt: {
      title: "Customize the character's personality",
      description:
        "Edit the character's system prompt and behavior. Sign up to get started.",
      backButton: "Back",
      signupButton: "Create Account",
      loginButton: "Log In",
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
      customIcon: {
        content: "Custom Icon: {{value}}",
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
    backButton: {
      label: "Back to Favorite",
    },
    deleteButton: {
      label: "Delete Favorite",
    },
    customizeCharacterButton: {
      label: "Customize Character's Personality",
    },
    useThisCharacterButton: {
      label: "Use This Character",
    },
    useThisModelButton: {
      label: "Use This Model",
    },
    currentlyActiveButton: {
      label: "Currently Active",
    },
    signupPrompt: {
      title: "Customize the character's personality",
      description:
        "Edit the character's system prompt and behavior. Sign up to get started.",
      backButton: "Back",
      signupButton: "Create Account",
      loginButton: "Log In",
    },
    saveButton: {
      label: "Save",
      loadingText: "Saving...",
    },
    saveAndUseButton: {
      label: "Save & Use",
      loadingText: "Saving & Activating...",
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
      label: "AI Voice",
      description: "Choose the voice for your AI assistant",
    },
    mode: {
      label: "Selection Mode",
    },
    modelSelection: {
      title: "Model Selection",
      label: "Model Selection",
      description:
        "Override the model for this slot. Use filters or pick a specific model. Pass null to use the character's default model.",
    },
    selectionType: {
      label: "Selection Type",
      characterBased: "Based on Character",

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
    icon: {
      label: "Custom Icon",
      description:
        "Override the character's default icon for this favorite slot",
    },
    allowedTools: {
      label: "Allowed Tools",
      description:
        "Override allowed tools for this slot. Each entry needs a toolId (use system_help_GET to discover available tool IDs). Set requiresConfirmation: true to prompt before executing. Pass null to fall through to character or global settings.",
    },
    pinnedTools: {
      label: "Pinned Tools",
      description:
        "Override pinned toolbar tools for this slot. Pass null to fall through to character or global settings.",
    },
    compactTrigger: {
      label: "Compact Trigger (tokens)",
      description:
        "Override the token count that triggers conversation compaction for this slot. Pass null to fall through to character or global default.",
    },
    changeCharacter: {
      label: "Change Character",
    },
    modifyCharacter: {
      label: "Modify Character",
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
    slotOverride: {
      label: "Override for this slot",
    },
    globalDefault: {
      label: "My default (fallback)",
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
      description: "Permanently remove this favorite configuration",
    },
    backButton: {
      label: "Cancel",
    },
    actions: {
      delete: "Delete Favorite",
      deleting: "Deleting Favorite",
    },
    id: {
      label: "Favorite ID",
      description: "The unique identifier of the favorite to delete",
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
