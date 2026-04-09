export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  voices: {
    MALE: "Male voice",
    FEMALE: "Female voice",
  },
  enums: {
    ownershipType: {
      system: "Built-in skill",
      user: "Created by you",
      public: "From community",
    },
  },

  get: {
    title: "Get skill",
    dynamicTitle: "skill: {{name}}",
    description: "Retrieve a specific skill by ID",
    container: {
      title: "skill Details",
      description: "Details of the requested skill",
    },
    backButton: {
      label: "Back to skills",
    },
    editButton: {
      label: "Edit skill",
    },
    customizeButton: {
      label: "Customize skill",
    },
    deleteButton: {
      label: "Delete skill",
    },
    addToFavoritesButton: {
      label: "Add to Favorites",
    },
    inCollection: "In collection",
    addAnother: "Add another",
    addAnotherTooltip: "Add another instance of this skill to your collection",
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
    yourskill: "Your skill",
    signupPrompt: {
      title: "Customize this skill",
      description:
        "Create a personalized version with your own settings and preferences. Sign up to get started.",
      backButton: "Back",
      signupButton: "Create Account",
      loginButton: "Log In",
    },
    id: {
      label: "skill ID",
      description: "The unique identifier of the skill",
    },
    systemPrompt: {
      label: "System Prompt",
    },
    models: {
      brain: "Brain",
      eyes: "Eyes",
      ears: "Ears & Voice",
      media: "Media",
      slots: {
        chat: "Chat",
        imageVision: "Image vision",
        videoVision: "Video vision",
        stt: "Speech to text",
        tts: "Text to speech",
        audioVision: "Audio vision",
        imageGen: "Image gen",
        musicGen: "Music gen",
        videoGen: "Video gen",
      },
    },
    response: {
      skill: {
        title: "skill",
        id: { content: "skill ID" },
        name: { content: "skill Name" },
        description: { content: "skill Description" },
        icon: { content: "skill Icon" },
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
        title: "skill Not Found",
        description: "The requested skill does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving the skill",
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
    voiceModelSelection: {
      systemDefault: "System default",
    },
    success: {
      title: "Success",
      description: "skill retrieved successfully",
    },
    share: {
      button: "Share & Earn",
      title: "Share this skill & earn",
      description:
        "Share this skill with your referral link. Earn 10% recurring commission from every user who signs up.",
      selectCode: "Select referral code:",
      noCodesYet: "No referral codes yet",
      createCode: "Create a code",
      codePlaceholder: "e.g. MYCODE",
      creating: "Creating...",
      linkReady: "Your share link:",
      copied: "Copied!",
      copyLink: "Copy Link",
      close: "Close",
    },
  },
  patch: {
    title: "Update skill",
    dynamicTitle: "Edit: {{name}}",
    container: {
      title: "Update skill",
      description: "Modify an existing custom skill",
    },
    backButton: {
      label: "Back to skill",
    },
    deleteButton: {
      label: "Delete skill",
    },
    submitButton: {
      label: "Update skill",
      loadingText: "Updating skill...",
    },
    actions: {
      update: "Update skill",
      updating: "Updating skill",
    },
    response: {
      success: {
        content: "skill updated successfully",
      },
    },
    id: {
      label: "skill ID",
      description: "The unique identifier of the skill to update",
    },
    name: {
      label: "skill Name",
      description:
        "Give your skill a memorable name. This is how you and others will identify them.",
      placeholder: "Enter skill name",
      validation: {
        minLength: "Name must be at least 2 skills",
        maxLength: "Name must be less than 100 skills",
      },
    },
    tagline: {
      label: "skill Tagline",
      description:
        "A catchy one-liner that captures the essence of your skill. Keep it short and descriptive.",
      placeholder: "Enter a short tagline",
      validation: {
        minLength: "Tagline must be at least 2 skills",
        maxLength: "Tagline must be less than 500 skills",
      },
    },
    icon: {
      label: "skill Icon",
      description:
        "Pick an emoji that represents your skill. This icon appears whenever the skill is displayed.",
    },
    description: {
      label: "skill Description",
      description:
        "Describe what makes this skill unique. What's their role? What can they help with? Be specific and detailed.",
      placeholder: "Describe your skill's purpose and capabilities",
      validation: {
        minLength: "Description must be at least 10 skills",
        maxLength: "Description must be less than 500 skills",
      },
    },
    category: {
      label: "Category",
      description:
        "Choose the category that best fits your skill. This helps with organization and discovery.",
    },
    isPublic: {
      label: "Make Public",
      description:
        "Enable this to share your skill with the community. When disabled, the skill remains private and only visible to you.",
    },
    chatModel: {
      label: "Chat Model",
      placeholder: "System default",
    },
    voice: {
      label: "Voice",
      description:
        "Select a text-to-speech voice for audio responses. Each skill can have their own unique voice.",
      placeholder: "System default",
    },
    sttModel: {
      label: "Speech-to-Text Model",
      description: "Model used for speech recognition",
      placeholder: "System default",
    },
    imageVisionModel: {
      label: "Image Vision Model",
      description: "Model used for analyzing images",
      placeholder: "System default",
    },
    videoVisionModel: {
      label: "Video Vision Model",
      description: "Model used for analyzing videos",
      placeholder: "System default",
    },
    audioVisionModel: {
      label: "Audio Vision Model",
      description: "Model used for analyzing audio",
      placeholder: "System default",
    },
    imageGenModel: {
      label: "Image Generation Model",
      description: "Model used for generating images",
      placeholder: "System default",
    },
    musicGenModel: {
      label: "Music Generation Model",
      description: "Model used for generating music",
      placeholder: "System default",
    },
    videoGenModel: {
      label: "Video Generation Model",
      description: "Model used for generating videos",
      placeholder: "System default",
    },
    defaultChatMode: {
      label: "Default Chat Mode",
      description: "Default mode when opening this chat",
    },
    systemPrompt: {
      label: "System Prompt",
      description:
        "Define your skill's behavior, personality, and expertise. This is the core instruction that shapes how the AI responds. Be detailed about tone, knowledge areas, and conversation style.",
      placeholder: "You are a helpful assistant who specializes in...",
      validation: {
        minLength: "System prompt must be at least 10 skills",
        maxLength: "System prompt must be less than 5000 skills",
      },
    },
    source: {
      label: "Source",
      description: "The source of this skill (built-in, custom, or community)",
    },
    modelSelection: {
      label: "Model Selection",
      description:
        "Choose how to select the AI model - either pick a specific model or let the system choose based on filters",
    },
    preferredModel: {
      label: "Preferred Model",
      description: "The preferred AI model for this skill",
    },
    availableTools: {
      label: "Allowed Tools",
      description:
        "List of tools this skill can use. Each entry needs a toolId (use system_help_GET to discover available tool IDs). Set requiresConfirmation: true to prompt before executing. Pass null to inherit from global settings.",
    },
    pinnedTools: {
      label: "Pinned Tools",
      description:
        "Tools pinned to the toolbar for quick access when using this skill. Subset of availableTools. Pass null to use default pinned tools.",
    },
    compactTrigger: {
      label: "Compact Trigger (tokens)",
      description:
        "Token count that triggers automatic conversation compaction. Set to null to use global default.",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "The skill data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update skills",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this skill",
      },
      notFound: {
        title: "skill Not Found",
        description: "The skill you're trying to update does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the skill",
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
        description: "A conflict occurred while updating the skill",
      },
    },
    success: {
      title: "skill Updated",
      description: "Your custom skill has been updated successfully",
    },
  },
  delete: {
    title: "Delete skill",
    dynamicTitle: "Delete: {{name}}",
    description: "Delete a custom skill",
    container: {
      title: "Delete skill",
      description: "Permanently remove this custom skill",
    },
    backButton: {
      label: "Back to skill",
    },
    actions: {
      delete: "Delete skill",
      deleting: "Deleting skill",
    },
    id: {
      label: "skill ID",
      description: "The unique identifier of the skill to delete",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The skill data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to delete this skill",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this skill",
      },
      notFound: {
        title: "skill Not Found",
        description: "The skill you are trying to delete does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the skill",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while deleting the skill",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "The skill has been modified by another user",
      },
    },
    success: {
      title: "skill Deleted",
      description: "The skill has been successfully deleted",
      content: "skill deleted successfully",
    },
  },
};
