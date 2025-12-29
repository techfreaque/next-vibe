import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  id: idTranslations,
  enums: {
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
    speed: {
      any: "Any",
      fast: "Fast",
      balanced: "Balanced",
      thorough: "Thorough",
    },
  },
  get: {
    title: "Get Favorites",
    description: "Retrieve all your saved favorite character configurations",
    container: {
      title: "Your Favorites",
      description: "Manage your favorite character and model configurations",
    },
    response: {
      favorite: {
        title: "Favorite Configuration",
        id: {
          content: "ID: {{value}}",
        },
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
    characterId: {
      label: "Character",
      description: "Select the character for this favorite",
    },
    customName: {
      label: "Custom Name",
      description: "Optional custom name for this favorite",
    },
    voice: {
      label: "Voice",
      description: "Text-to-speech voice preference",
    },
    mode: {
      label: "Selection Mode",
      description: "How the model should be selected",
    },
    intelligence: {
      label: "Intelligence Level",
      description: "Minimum intelligence level required",
    },
    maxPrice: {
      label: "Max Price",
      description: "Maximum price tier to use",
    },
    content: {
      label: "Content Level",
      description: "Content moderation level",
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
};
