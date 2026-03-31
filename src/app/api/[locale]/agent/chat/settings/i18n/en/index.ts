export const translations = {
  category: "Chat",
  tags: {
    settings: "Settings",
  },
  voices: {
    MALE: "Male voice",
    FEMALE: "Female voice",
  },
  get: {
    title: "Get Chat Settings",
    description: "Retrieve user's chat settings and preferences",
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
        description: "You must be logged in to access settings",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "Settings not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving settings",
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
      description: "Settings retrieved successfully",
    },
  },
  post: {
    title: "Update Chat Settings",
    description: "Update user's chat settings and preferences",
    container: {
      title: "Chat Settings",
    },
    selectedModel: {
      label: "Selected Model",
    },
    selectedSkill: {
      label: "Selected Skill",
    },
    activeFavoriteId: {
      label: "Active Favorite",
    },
    ttsAutoplay: {
      label: "TTS Autoplay",
    },
    ttsVoice: {
      label: "TTS Voice",
    },
    sttModel: {
      label: "Speech-to-Text Model",
    },
    visionBridgeModel: {
      label: "Vision Model",
    },
    translationModel: {
      label: "Translation Model",
    },
    defaultChatMode: {
      label: "Default Chat Mode",
    },
    viewMode: {
      label: "View Mode",
    },
    availableTools: {
      label: "Allowed Tools",
    },
    pinnedTools: {
      label: "Pinned Tools",
    },
    compactTrigger: {
      label: "Compact Trigger (tokens)",
    },
    memoryLimit: {
      label: "Memory Limit (tokens)",
      description:
        "Maximum total tokens of memory content injected per turn. Leave empty to use the system default (1000 tokens).",
    },
    codingAgent: {
      label: "Coding Agent",
      description:
        "Which coding agent CLI to use when AI calls the coding agent tool. Admin-only setting.",
      options: {
        claudeCode: "Claude Code (default)",
        openCode: "OpenCode",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid settings provided",
      },
      network: {
        title: "Network Error",
        description: "Failed to save settings",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update settings",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update settings",
      },
      notFound: {
        title: "Not Found",
        description: "Settings not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to save settings",
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
        description: "Settings conflict occurred",
      },
    },
    success: {
      title: "Settings Saved",
      description: "Your settings have been saved successfully",
    },
  },
};
