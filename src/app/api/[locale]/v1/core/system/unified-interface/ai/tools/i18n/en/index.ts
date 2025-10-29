export const translations = {
  get: {
    title: "Get Available AI Tools",
    description: "Retrieve list of AI tools available for current user",
    response: {
      title: "AI Tools Response",
      description: "List of available AI tools",
    },
    fields: {
      tools: {
        title: "Available Tools",
      },
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
