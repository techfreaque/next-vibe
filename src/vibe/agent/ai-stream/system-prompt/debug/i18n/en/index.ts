export const translations = {
  get: {
    title: "System Prompt Debug",
    titleShort: "Debug Prompt",
    description:
      "Shows the exact system prompt the AI gets in a given context — folder, skill, thread, message.",
    status: {
      loading: "Building...",
      done: "Done",
    },
    tags: {
      debug: "Debug",
    },
    fields: {
      rootFolderId: {
        label: "Root Folder",
        description:
          "Folder context to simulate (private, public, incognito, cron, shared, remote)",
        placeholder: "private",
        options: {
          private: "Private",
          shared: "Shared",
          public: "Public",
          incognito: "Incognito",
          background: "Background",
          remote: "Remote",
        },
      },
      userRole: {
        label: "User Role",
        description: "Simulated user role: public | customer | admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "User Message",
        description: "Simulated user message for cortex embedding search",
        placeholder: "What did we discuss last time?",
      },
      threadId: {
        label: "Thread ID",
        description: "Optional thread ID for context",
        placeholder: "uuid or leave blank",
      },
      userId: {
        label: "User ID",
        description:
          "Optional user ID to load cortex data for (defaults to self)",
        placeholder: "uuid or leave blank",
      },
      skillId: {
        label: "Skill ID",
        description: "Optional skill ID to inject into system prompt",
        placeholder: "skill uuid or leave blank",
      },
      subFolderId: {
        label: "Sub-folder ID",
        description: "Optional sub-folder UUID",
        placeholder: "uuid or leave blank",
      },
      imageGenModelSelection: {
        label: "Image Gen Selection",
        description:
          "Image gen model selection from the active favorite/chat UI (leave blank to use user default)",
        placeholder: "leave blank for user default",
      },
      musicGenModelSelection: {
        label: "Music Gen Selection",
        description:
          "Music gen model selection from the active favorite/chat UI (leave blank to use user default)",
        placeholder: "leave blank for user default",
      },
      videoGenModelSelection: {
        label: "Video Gen Selection",
        description:
          "Video gen model selection from the active favorite/chat UI (leave blank to use user default)",
        placeholder: "leave blank for user default",
      },
    },
    response: {
      systemPrompt: { text: "System Prompt" },
      trailingSystemMessage: { text: "Trailing Context" },
      charCount: { text: "Skills" },
      tokenEstimate: { text: "~Tokens" },
      cortexDiagnostics: { text: "Cortex Embedding Diagnostics" },
      messageContextLines: { text: "Message Context Lines" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check your params" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "Admin Only", description: "Requires admin access" },
      notFound: {
        title: "Not Found",
        description: "User or resource not found",
      },
      server: { title: "Server Error", description: "Failed to build prompt" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved",
        description: "Save or discard first",
      },
      conflict: { title: "Conflict", description: "Conflicting state" },
    },
    widget: {
      emptyTitle: "Pick a context",
      emptyMessage:
        "Choose a folder, optionally a message, then build the prompt.",
      chars: "Characters",
      tokens: "~Tokens",
      cortexFailed: "Cortex embedding failed — no API key or provider error.",
      cortexNoNodes:
        "Embedding generated, but no cortex nodes have embeddings yet.",
      cortexPassing: "{{passing}} of {{total}} matches pass the threshold",
      noTrailing: "No trailing context for this request.",
    },
    success: {
      title: "Prompt Built",
      description: "System prompt rendered successfully",
    },
  },
};
