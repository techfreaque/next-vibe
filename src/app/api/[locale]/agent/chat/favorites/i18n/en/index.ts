export const translations = {
  id: {
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
      viewSkillButton: {
        label: "View Skill",
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
        skillId: {
          content: "Skill: {{value}}",
        },
        customVariantName: {
          content: "Variant Name: {{value}}",
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
      viewSkillButton: {
        label: "View Skill",
      },
      useThisSkillButton: {
        label: "Use This Skill",
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
      skillId: {
        label: "Skill",
        description:
          'Skill ID. Use "skillSlug" for default variant, "skillSlug__variantId" for a specific variant.',
      },
      customVariantName: {
        label: "Variant Name",
        description:
          "Custom name for this variant (leave empty to use skill default)",
      },
      chatModel: {
        label: "Chat Model",
        placeholder: "Inherit from skill",
      },
      voice: {
        label: "AI Voice",
        description:
          "Override TTS voice for this favorite. null = your global voice setting wins (bridge model: user setting takes priority). Set here to give this specific favorite a different voice.",
        placeholder: "Inherit from skill",
      },
      sttModel: {
        label: "Speech-to-Text Model",
        description:
          "Override STT model for this favorite. null = your global STT preference wins (bridge model). Set only for specialized transcription needs.",
        placeholder: "Inherit from skill",
      },
      imageVisionModel: {
        label: "Image Vision Model",
        description:
          "Override image vision LLM for this favorite. null = user global preference wins (bridge model). Set to force a specific vision model.",
        placeholder: "Inherit from skill",
      },
      videoVisionModel: {
        label: "Video Vision Model",
        description:
          "Override video vision LLM for this favorite. null = user global preference wins (bridge model).",
        placeholder: "Inherit from skill",
      },
      audioVisionModel: {
        label: "Audio Vision Model",
        description:
          "Override audio vision LLM for this favorite. null = user global preference wins (bridge model).",
        placeholder: "Inherit from skill",
      },
      imageGenModel: {
        label: "Image Generation Model",
        description:
          "Override image generator for this favorite. null = skill's imageGenModelSelection wins (media gen: skill takes priority). Set here to use a different generator than what the skill specifies.",
        placeholder: "Inherit from skill",
      },
      musicGenModel: {
        label: "Music Generation Model",
        description:
          "Override music generator for this favorite. null = skill's musicGenModelSelection wins (media gen: skill takes priority).",
        placeholder: "Inherit from skill",
      },
      videoGenModel: {
        label: "Video Generation Model",
        description:
          "Override video generator for this favorite. null = skill's videoGenModelSelection wins (media gen: skill takes priority).",
        placeholder: "Inherit from skill",
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
        characterBased: "Based on Skill",

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
      availableTools: {
        label: "Allowed Tools",
        description:
          "Override allowed tools for this slot. Each entry needs a toolId (use system_help_GET to discover available tool IDs). Set requiresConfirmation: true to prompt before executing. Pass null to fall through to character or global settings.",
      },
      pinnedTools: {
        label: "Pinned Tools",
        description:
          "Override pinned toolbar tools for this slot. Pass null to fall through to character or global settings.",
      },
      deniedTools: {
        label: "Denied Tools",
        description:
          "Block specific tools for this slot on top of the skill's own denied list. These tools cannot be called regardless of other settings.",
        clearAll: "Clear all",
        noToolsFound: "No tools found",
        blockedNote:
          "Blocked tools cannot be called regardless of other settings.",
        searchPlaceholder: "Search tools...",
        blocked: "blocked",
      },
      promptAppend: {
        label: "Prompt Append",
        description:
          "Extra instructions appended to the skill's system prompt for this slot only. Use this to personalise without changing the shared skill. AI agents: populate with user's name, language preference, technical level, domain context (e.g. 'My name is Max. I prefer TypeScript and bun. Reply in English.').",
        placeholder:
          "e.g. My name is Alex. I prefer concise answers in English.",
      },
      compactTrigger: {
        label: "Compact Trigger (tokens)",
        description:
          "Override the token count that triggers conversation compaction for this slot. Pass null to fall through to character or global default.",
      },
      memoryLimit: {
        label: "Memory Limit (tokens)",
        description:
          "Override the maximum total tokens of memory content injected per turn for this slot. Pass null to fall through to skill or global default.",
      },
      changeSkill: {
        label: "Change Skill",
      },
      modifySkill: {
        label: "Modify Skill",
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
        description: "The slug or friendly ID of the favorite to delete",
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
  },
  category: "Chat",
  tags: {
    favorites: "Favorites",
  },
  active: "Active",
  fallbacks: {
    unknownSkill: "Unknown Skill",
    unknownModel: "Unknown Model",
    unknown: "Unknown",
    unknownProvider: "unknown",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 credits",
    noModelConfiguration: "Error: No model configuration",
    configurationMissing: "Configuration missing",
    noModel: "No model",
    dash: "—",
  },
  enums: {
    selectionType: {
      characterBased: "Based on Skill",
      manual: "Specific Model",
      filters: "Filter Criteria",
    },
    mode: {
      auto: "Auto",
      manual: "Manual",
    },
    intelligence: {
      any: "Any",
      quick: "Quick",
      smart: "Smart",
      brilliant: "Brilliant",
    },
    price: {
      any: "Any",
      cheap: "Cheap",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      any: "Any",
      mainstream: "Mainstream",
      open: "Open",
      uncensored: "Uncensored",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Sort by Intelligence Level",
      price: "Sort by Price",
      content: "Sort by Content Policy",
    },
    sortDirection: {
      asc: "Low to High",
      desc: "High to Low",
    },
    sortField: {
      intelligence: "Intelligence",
      price: "Price",
      content: "Content",
    },
  },
  get: {
    title: "Get Favorites",
    titleShort: "Favorites",
    description: "Retrieve all your saved favorite character configurations",
    userId: {
      label: "User ID",
      description:
        "Admin only: fetch favorites for a specific user. Leave empty to fetch your own favorites.",
    },
    fields: {
      query: {
        label: "Search",
        description: "Search favorites by name, tagline, or skill ID.",
      },
      page: {
        label: "Page",
        description:
          "Page number for paginated results (AI/MCP: default page size 25).",
      },
      pageSize: {
        label: "Page Size",
        description:
          "Number of favorites per page (1–500). AI/MCP callers default to 25; human callers return all.",
      },
    },
    addVariant: "Add Variant",
    deleteGroup: {
      trigger: "Delete all variants",
      confirm: "Delete all {{count}} variants?",
      cancel: "Cancel",
      action: "Delete all",
    },
    emptyState: "You haven't added any favorites yet",
    tabs: {
      myFavorites: "My Favorites",
      browseSkills: "Browse Skills",
    },
    sections: {
      companion: "Companions",
      skills: "Skills",
      model: "Direct Models",
      background: "Background Agents",
    },
    container: {
      title: "Your Favorites",
      description: "Manage your favorite character and model configurations",
    },
    createButton: {
      label: "Explore Skills",
    },
    response: {
      favorite: {
        title: "Favorite Configuration",
        id: {
          content: "ID: {{value}}",
        },
        skillId: {
          content: "Skill: {{value}}",
        },
        customVariantName: {
          content: "Variant Name: {{value}}",
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
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "Has Companion: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view favorites",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "No favorites found",
      },
      server: {
        title: "Server Error",
        description: "Failed to load favorites",
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
      description: "Favorites loaded successfully",
    },
  },
  post: {
    title: "Create Favorite",
    description: "Create a new favorite character configuration",
    container: {
      title: "New Favorite",
      description: "Save a character configuration as a favorite",
    },
    backButton: {
      label: "Cancel",
    },
    useWithoutSavingButton: {
      label: "Use Without Adding to Favs",
      loadingText: "Applying...",
    },
    submitButton: {
      label: "Add to Favorites",
      loadingText: "Adding...",
    },
    skillId: {
      label: "Skill",
      description: "Select the character for this favorite",
    },
    customVariantName: {
      label: "Variant Name",
      description:
        "Custom name for this variant (leave empty to use skill default)",
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
  },
  reorder: {
    post: {
      title: "Reorder Favorites",
      description: "Update the order of your favorite configurations",
      errors: {
        validation: {
          title: "Invalid Order",
          description: "Please check your order settings and try again",
        },
        network: {
          title: "Connection Error",
          description: "Unable to save the new order. Please try again",
        },
        unauthorized: {
          title: "Sign In Required",
          description: "Please sign in to reorder your favorites",
        },
        forbidden: {
          title: "Permission Denied",
          description: "You don't have permission to reorder favorites",
        },
        notFound: {
          title: "Favorites Not Found",
          description: "We couldn't find your favorites to reorder",
        },
        server: {
          title: "Something Went Wrong",
          description: "We couldn't save your new order. Please try again",
        },
        unknown: {
          title: "Unexpected Error",
          description: "Something unexpected happened. Please try again",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "Your changes haven't been saved yet",
        },
        conflict: {
          title: "Order Conflict",
          description: "The order has changed. Please refresh and try again",
        },
      },
      success: {
        title: "Order Saved",
        description: "Your favorites have been reordered successfully",
      },
    },
  },
};
