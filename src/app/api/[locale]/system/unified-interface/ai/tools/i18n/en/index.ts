export const translations = {
  get: {
    title: "Tool Help — Discover Available AI Tools",
    description:
      "Search and discover all AI tools available to you. Use query to search by name, description, or alias. Use category to filter by tool category. Returns tool names, descriptions, aliases, and metadata.",
    response: {
      title: "AI Tools Response",
      description: "List of available AI tools",
    },
    fields: {
      query: {
        label: "Search Query",
        description:
          "Search tools by name, description, alias, or tag (case-insensitive)",
        placeholder: "e.g. search, memory, fetch...",
      },
      category: {
        label: "Category Filter",
        description: "Filter tools by category name (case-insensitive)",
      },
      toolName: {
        label: "Tool Name (Detail)",
        description:
          "Get full details for a specific tool by name or alias. Returns parameter schema.",
      },
      tools: {
        title: "Available Tools",
      },
      totalCount: {
        title: "Total tool count",
      },
      matchedCount: {
        title: "Matched tool count",
      },
      categories: {
        title: "Tool categories",
      },
      hint: {
        title: "Usage hint",
      },
    },
    submitButton: {
      label: "Search Tools",
      loadingText: "Searching...",
    },
    widget: {
      totalTools: "{{count}} tools available",
      matchedOf: "{{matched}} of {{total}} tools",
      categories: "{{count}} categories",
      noToolsFound: "No tools found matching your search",
    },
    success: {
      title: "Tools fetched successfully",
      description: "Available AI tools retrieved",
    },
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
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access AI tools",
      },
      notFound: {
        title: "Not Found",
        description: "AI tools endpoint not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to fetch tools",
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
        description: "A conflict occurred while fetching AI tools",
      },
    },
  },
  category: "AI Tools",
  tags: {
    tools: "tools",
  },
};
