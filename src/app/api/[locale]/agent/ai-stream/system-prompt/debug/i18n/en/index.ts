export const translations = {
  get: {
    title: "System Prompt Debug",
    description:
      "Render the full system prompt for a given user context. Admin/dev only.",
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
    },
    response: {
      systemPrompt: { text: "System Prompt" },
      trailingSystemMessage: { text: "Trailing Context" },
      charCount: { text: "Characters" },
      tokenEstimate: { text: "~Tokens" },
      cortexDiagnostics: { text: "Cortex Embedding Diagnostics" },
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
    success: {
      title: "Prompt Built",
      description: "System prompt rendered successfully",
    },
  },
};
