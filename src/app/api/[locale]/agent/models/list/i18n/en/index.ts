export const translations = {
  tags: {
    models: "Models",
  },
  endpointCategories: {
    ai: "AI",
  },
  get: {
    title: "List AI Models",
    description:
      "Browse and search all available AI models. Filter by type, content level, intelligence, price, or capabilities. Use this to find the right model for your task.",
    dynamicTitle: "{{count}} models",

    fields: {
      query: {
        label: "Search",
        description:
          "Filter models by name, provider, or capability (e.g. 'coding', 'uncensored', 'image', 'fast').",
        placeholder: "e.g. GPT, Gemini, coding, uncensored…",
      },
      modelType: {
        label: "Type",
        description:
          "Filter by model type: text (chat/LLM), image (image generation), video, or audio (TTS/STT/music). Leave empty for all types.",
        placeholder: "All types",
      },
      contentLevel: {
        label: "Content Level",
        description:
          "Filter by content policy. Mainstream = standard safety filters. Open = fewer restrictions. Uncensored = no filters.",
        placeholder: "All content levels",
      },
      intelligence: {
        label: "Intelligence",
        description:
          "Minimum intelligence tier. Quick = fast & efficient. Smart = balanced quality. Brilliant = deep reasoning.",
        placeholder: "Any intelligence",
      },
      page: {
        label: "Page",
        description: "Page number for pagination (starts at 1).",
      },
      pageSize: {
        label: "Page size",
        description: "Number of models per page (default 50, max 200).",
      },
    },

    response: {
      models: "Models",
      totalCount: "Total",
      matchedCount: "Matched",
      currentPage: "Page",
      totalPages: "Pages",
      hint: "Hint",
      model: {
        id: "Model ID",
        name: "Name",
        provider: "Provider",
        type: "Type",
        description: "Description",
        contextWindow: "Context",
        parameterCount: "Parameters",
        intelligence: "Intelligence",
        speed: "Speed",
        content: "Content",
        price: "Price (credits)",
        supportsTools: "Tools",
        utilities: "Capabilities",
        inputs: "Inputs",
        outputs: "Outputs",
      },
    },

    errors: {
      server: {
        title: "Server Error",
        description: "Failed to retrieve model list. Please try again.",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed. Please check your connection.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred.",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid filter parameters.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view models.",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to access this resource.",
      },
      notFound: {
        title: "Not Found",
        description: "No models found.",
      },
      conflict: {
        title: "Conflict",
        description: "Request conflict.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes.",
      },
    },

    success: {
      title: "Models loaded",
      description: "AI model list retrieved successfully.",
    },

    browser: {
      supportsTools: "✓ tools",
      noModels: "No models match your filters.",
      allLabel: "All",
      statsLabel: "{{matched}} of {{total}} models",
      free: "Free",
      credits: "~{{cost}}cr",
      ctx: "ctx",
    },
  },
} as const;
