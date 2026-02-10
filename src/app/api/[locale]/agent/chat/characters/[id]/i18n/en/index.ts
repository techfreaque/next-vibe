export const translations = {
  get: {
    title: "Get Character",
    description: "Retrieve a specific character by ID",
    container: {
      title: "Character Details",
      description: "Details of the requested character",
    },
    backButton: {
      label: "Back to Characters",
    },
    editButton: {
      label: "Edit Character",
    },
    customizeButton: {
      label: "Customize Character",
    },
    deleteButton: {
      label: "Delete Character",
    },
    addToFavoritesButton: {
      label: "Add to Favorites",
    },
    inCollection: "In collection",
    addAnother: "Add another",
    addAnotherTooltip:
      "Add another instance of this character to your collection",
    addToCollection: "Add to your collection:",
    quickAdd: "Quick Add",
    tweakAndAdd: "Tweak & Add",
    edit: "Edit",
    copyAndCustomize: "Copy & Customize",
    delete: "Delete",
    actions: "Actions",
    designSelector: {
      label: "Design:",
      current: "Current",
      a: "A: App Store",
      b: "B: Split Header",
      c: "C: Card Hero",
      d: "D: Two-Row",
    },
    yourCharacter: "Your character",
    signupPrompt: {
      title: "Customize this character",
      description:
        "Create a personalized version with your own settings and preferences. Sign up to get started.",
      backButton: "Back",
      signupButton: "Create Account",
      loginButton: "Log In",
    },
    id: {
      label: "Character ID",
      description: "The unique identifier of the character",
    },
    systemPrompt: {
      label: "System Prompt",
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
    backButton: {
      label: "Back to Character",
    },
    deleteButton: {
      label: "Delete Character",
    },
    submitButton: {
      label: "Update Character",
      loadingText: "Updating Character...",
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
      label: "Character Name",
      description:
        "Give your character a memorable name. This is how you and others will identify them.",
      placeholder: "Enter character name",
      validation: {
        minLength: "Name must be at least 2 characters",
        maxLength: "Name must be less than 100 characters",
      },
    },
    tagline: {
      label: "Character Tagline",
      description:
        "A catchy one-liner that captures the essence of your character. Keep it short and descriptive.",
      placeholder: "Enter a short tagline",
      validation: {
        minLength: "Tagline must be at least 2 characters",
        maxLength: "Tagline must be less than 500 characters",
      },
    },
    icon: {
      label: "Character Icon",
      description:
        "Pick an emoji that represents your character. This icon appears whenever the character is displayed.",
    },
    description: {
      label: "Character Description",
      description:
        "Describe what makes this character unique. What's their role? What can they help with? Be specific and detailed.",
      placeholder: "Describe your character's purpose and capabilities",
      validation: {
        minLength: "Description must be at least 10 characters",
        maxLength: "Description must be less than 500 characters",
      },
    },
    category: {
      label: "Category",
      description:
        "Choose the category that best fits your character. This helps with organization and discovery.",
    },
    isPublic: {
      label: "Make Public",
      description:
        "Enable this to share your character with the community. When disabled, the character remains private and only visible to you.",
    },
    voice: {
      label: "Voice",
      description:
        "Select a text-to-speech voice for audio responses. Each character can have their own unique voice.",
    },
    systemPrompt: {
      label: "System Prompt",
      description:
        "Define your character's behavior, personality, and expertise. This is the core instruction that shapes how the AI responds. Be detailed about tone, knowledge areas, and conversation style.",
      placeholder: "You are a helpful assistant who specializes in...",
      validation: {
        minLength: "System prompt must be at least 10 characters",
        maxLength: "System prompt must be less than 5000 characters",
      },
    },
    source: {
      label: "Source",
      description:
        "The source of this character (built-in, custom, or community)",
    },
    modelSelection: {
      label: "Model Selection",
      description: "How the AI model is selected for this character",
    },
    preferredModel: {
      label: "Preferred Model",
      description: "The preferred AI model for this character",
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
    backButton: {
      label: "Back to Character",
    },
    actions: {
      delete: "Delete Character",
      deleting: "Deleting Character",
    },
    id: {
      label: "Character ID",
      description: "The unique identifier of the character to delete",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The character data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to delete this character",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this character",
      },
      notFound: {
        title: "Character Not Found",
        description: "The character you are trying to delete does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the character",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unexpected error occurred while deleting the character",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "The character has been modified by another user",
      },
    },
    success: {
      title: "Character Deleted",
      description: "The character has been successfully deleted",
      content: "Character deleted successfully",
    },
  },
};
