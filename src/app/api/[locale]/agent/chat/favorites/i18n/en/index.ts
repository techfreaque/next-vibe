import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  id: idTranslations,
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
