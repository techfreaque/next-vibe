/**
 * English translations for WS Provider Models endpoint
 */

export const translations = {
  category: "AI Models",
  tags: {
    models: "models",
    aiModels: "ai-models",
  },
  get: {
    title: "List AI Models",
    description:
      "Returns all available AI models with pricing and capability information",
    response: {
      models: {
        title: "Models",
      },
      id: {
        content: "Model ID",
      },
      name: {
        content: "Name",
      },
      provider: {
        content: "Provider",
      },
      category: {
        content: "Category",
      },
      description: {
        content: "Description",
      },
      contextWindow: {
        content: "Context Window",
      },
      supportsTools: {
        content: "Supports Tools",
      },
      creditCost: {
        content: "Credit Cost",
      },
    },
    success: {
      title: "Models Retrieved",
      description: "AI model list retrieved successfully",
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
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "Models not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve models",
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
        description: "A conflict occurred",
      },
    },
  },
};
