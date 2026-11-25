export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    group: {
      uncensoredAi: "Uncensored.ai (Uncensored LM)",
      zai: "Z.AI (GLM)",
      moonshot: "Moonshot (Kimi)",
      deepseek: "DeepSeek",
      venice: "Venice",
      xai: "xAI (Grok)",
      anthropic: "Anthropic (Claude)",
      openai: "OpenAI (GPT)",
      google: "Google (Gemini)",
      otherChat: "Other chat models",
      image: "Image generation",
      video: "Video generation",
      music: "Music generation",
      voice: "Voice (TTS + STT)",
      tools: "Tools (search, fetch, memory)",
      unattributed: "Unattributed",
    },
  },
  post: {
    titleShort: "Spend by Model",
    title: "Credits Spent by Model Family",
    description:
      "Credits spent per bucket on one group: chat models by maker (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, other), image, video, music, voice, tools. Every spender included, so the groups add up to all spend. In credits.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      group: {
        label: "Group",
        description:
          "Model family (chat models by maker) or media / tool group to count",
      },
      result: {
        label: "Credits Spent",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Series computed",
      description: "Time series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: { title: "Server error", description: "Query failed" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: { title: "Not found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict" },
      network: {
        title: "Network error",
        description: "Network request failed",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save changes first",
      },
    },
  },
};
