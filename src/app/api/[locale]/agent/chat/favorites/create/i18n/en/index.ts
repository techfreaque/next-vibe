export const translations = {
  post: {
    title: "Create Favorite",
    description: "Create a new favorite character configuration",
    container: {
      title: "New Favorite",
      description: "Save a character configuration as a favorite",
    },
    backButton: {
      label: "Back to Favorites",
    },
    submitButton: {
      label: "Create Favorite",
      loadingText: "Creating...",
    },
    characterId: {
      label: "Character",
      description: "Select the character for this favorite",
    },
    customName: {
      label: "Custom Name",
      description: "Optional custom name for this favorite",
    },
    customIcon: {
      label: "Custom Icon",
      description: "Optional custom icon for this favorite",
    },
    voice: {
      label: "Voice",
      description: "Text-to-speech voice preference",
    },
    mode: {
      label: "Selection Mode",
      description: "How the model should be selected",
    },
    modelSelection: {
      title: "Model Selection",
      description:
        "Choose how to select the AI model - either pick a specific model or let the system choose based on filters",
    },
    selectionType: {
      label: "Selection Type",
      characterBased: "Based on Character",
      manual: "Specific Model",
      filters: "Filter Criteria",
    },
    intelligence: {
      label: "Intelligence Level",
      description: "Minimum intelligence level required",
    },
    intelligenceRange: {
      label: "Intelligence Range",
      description: "Required intelligence/capability level for the model",
      minLabel: "Min Intelligence",
      maxLabel: "Max Intelligence",
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
    priceRange: {
      label: "Price Range",
      description: "Credit cost range per message",
      minLabel: "Min Price",
      maxLabel: "Max Price",
    },
    minPrice: {
      label: "Minimum Price",
      description: "Minimum credit cost per message",
    },
    maxPrice: {
      label: "Max Price",
      description: "Maximum price tier to use",
    },
    contentRange: {
      label: "Content Range",
      description: "Content moderation level range",
      minLabel: "Min Content",
      maxLabel: "Max Content",
    },
    minContent: {
      label: "Minimum Content Level",
      description: "Minimum content moderation level for the model",
    },
    maxContent: {
      label: "Maximum Content Level",
      description: "Maximum content moderation level for the model",
    },
    speedRange: {
      label: "Speed Range",
      description: "Response speed level range",
      minLabel: "Min Speed",
      maxLabel: "Max Speed",
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
      description: "Content moderation level",
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
      description: "Specific model to use (for manual mode)",
    },
    response: {
      id: {
        content: "Created favorite with ID: {{value}}",
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
        description: "You must be logged in to add favorites",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create favorites",
      },
      notFound: {
        title: "Not Found",
        description: "The item you are trying to favorite does not exist",
      },
      server: {
        title: "Server Error",
        description: "Failed to add to favorites",
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
        description: "This favorite already exists",
      },
    },
    success: {
      title: "Success",
      description: "Favorite created successfully",
    },
    changeCharacter: {
      label: "Change Character",
    },
    modifyCharacter: {
      label: "Modify Character",
    },
  },
};
