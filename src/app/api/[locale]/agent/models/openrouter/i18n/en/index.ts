export const translations = {
  get: {
    title: "Fetch OpenRouter Model Pricing",
    description:
      "Fetch model pricing and metadata from OpenRouter API and update models.ts",
    form: {
      title: "OpenRouter Model Pricing",
    },
    response: {
      summary: {
        title: "Update Summary",
        totalModels: "Total Models",
        modelsFound: "Models Found",
        modelsUpdated: "Models Updated",
        fileUpdated: "File Updated",
      },
      models: {
        title: "Updated Models",
        model: {
          id: "Model ID",
          name: "Model Name",
          contextLength: "Context Length",
          inputTokenCost: "Input Cost ($/1M tokens)",
          outputTokenCost: "Output Cost ($/1M tokens)",
        },
      },
      missingOpenRouterModels: {
        title: "Missing OpenRouter Models",
        model: {
          modelId: "Model ID",
          openRouterId: "OpenRouter ID",
          suggestion: "Suggestion",
        },
      },
      nonOpenRouterModels: {
        title: "Non-OpenRouter Models",
        model: {
          modelId: "Model ID",
          provider: "Provider",
        },
      },
    },
    errors: {
      server: {
        title: "Server Error",
        description: "Failed to fetch from OpenRouter API",
      },
      network: {
        title: "Network Error",
        description: "Could not connect to OpenRouter API",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform this action",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while processing the request",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Successfully fetched and updated model pricing",
    },
  },
  tags: {
    models: "Models",
  },
};
