export const translations = {
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
    selectedCharacter: {
      label: "Selected Character",
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
    viewMode: {
      label: "View Mode",
    },
    enabledTools: {
      label: "Enabled Tools",
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
