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
    viewMode: {
      label: "View Mode",
    },
    contextMemory: {
      title: "Context Memory Budget",
      description:
        "How far back the AI remembers your conversation before it starts summarising.",
      costNote: "Lower = cheaper",
      costExplain:
        "(to a point) – you trade a little memory for lower per-message cost.",
      tooltipTitle: "How much conversation history the AI keeps",
      tooltipBody:
        "When the conversation grows past this limit, older messages are automatically summarised. The AI stays coherent but uses fewer tokens – reducing cost.",
      tooltipModelCap: "Current model supports up to {cap} tokens.",
      default: "default",
      tokens: "tokens",
      modelMax: "model max",
      resetToDefault: "Reset to default ({value})",
      cheaper: "cheaper",
      moreMemory: "more memory",
      barCheap: "Lower cost · shorter memory",
      barBalanced: "Balanced cost & memory",
      barRich: "Richer memory · higher cost",
      barMax: "Maximum memory · highest cost",
      tools: "Tools",
      toolsInherited: "inherited",
    },
    searchProvider: {
      label: "Search Provider",
      description:
        "Your preferred web search engine. Auto picks the cheapest available provider.",
      auto: "Auto",
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
    dreaming: {
      title: "Dreaming",
      description:
        "AI sorts your brain while you sleep — consolidates memories, cleans up documents, surfaces what matters.",
      toggle: {
        label: "Enable Dreaming",
      },
      schedule: {
        label: "Schedule",
        options: {
          nightlyAt2: "2:00 AM nightly",
          weekdaysAt2: "2:00 AM weekdays",
          weekdaysAt8: "8:00 AM weekdays",
          every6h: "Every 6 hours",
          every12h: "Every 12 hours",
        },
      },
      favoriteId: {
        label: "Favorite slot",
        defaultOption: "Default (Thea)",
      },
      prompt: {
        label: "Session prompt",
        placeholder:
          "What should Thea focus on this session? Leave blank for the default.",
        defaultPrompt:
          "Run your dreaming session. Reorganize and consolidate the cortex — memories, documents, threads. Leave everything cleaner and more organized.",
      },
      lastRun: "Last run:",
      neverRun: "Never run",
      folderLink: "Open Dreams folder",
      runNow: "Run now",
    },
    autopilot: {
      title: "Autopilot",
      description:
        "AI works your queue while you're away — picks up next steps, advances projects, handles what's waiting.",
      toggle: {
        label: "Enable Autopilot",
      },
      schedule: {
        label: "Schedule",
        options: {
          nightlyAt2: "2:00 AM nightly",
          weekdaysAt2: "2:00 AM weekdays",
          weekdaysAt8: "8:00 AM weekdays",
          every6h: "Every 6 hours",
          every12h: "Every 12 hours",
        },
      },
      favoriteId: {
        label: "Favorite slot",
        defaultOption: "Default (Thea)",
      },
      prompt: {
        label: "Session prompt",
        placeholder:
          "What should Hermes focus on this session? Leave blank for the default.",
        defaultPrompt:
          "Run your autopilot session. Pick up where active projects left off — advance next steps, handle queued work, keep things moving.",
      },
      lastRun: "Last run:",
      neverRun: "Never run",
      folderLink: "Open Autopilot folder",
      runNow: "Run now",
    },
    mama: {
      title: "Platform Heartbeat",
      description:
        "Thea monitors your production instance — checks health, advances features, handles marketing, sends news. One shared slot across all admins.",
      toggle: {
        label: "Enable Mama Mode",
      },
      schedule: {
        label: "Schedule",
        options: {
          every4h: "Every 4 hours",
          every6h: "Every 6 hours",
          every12h: "Every 12 hours",
          daily: "Daily at midnight",
        },
      },
      prompt: {
        label: "Session prompt",
        placeholder: "What should Thea focus on? Leave blank for the default.",
        defaultPrompt:
          "Run your mama session. Check platform health, review error logs, advance any pending feature work, and draft any needed announcements. Leave a summary in /documents/mama/log/.",
      },
      lastRun: "Last run:",
      neverRun: "Never run",
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
  patch: {
    chatModel: {
      label: "Chat Model",
      placeholder: "System default",
    },
  },
};
