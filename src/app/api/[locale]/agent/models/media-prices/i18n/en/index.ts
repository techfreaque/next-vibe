export const translations = {
  category: "Agent",

  get: {
    title: "Fetch Media Model Pricing",
    description:
      "Fetch real-time pricing for image and audio generation models from Replicate, OpenAI, Fal.ai, and OpenRouter, then update models.ts",
    form: {
      title: "Media Model Pricing",
    },
    response: {
      summary: {
        title: "Update Summary",
        totalModels: "Total Media Models",
        modelsUpdated: "Models Updated",
        fileUpdated: "File Updated",
      },
      models: {
        title: "Updated Models",
        model: {
          id: "Model ID",
          name: "Model Name",
          provider: "Provider",
          costUsd: "Cost (USD)",
          creditCost: "Credits",
          source: "Price Source",
        },
      },
    },
    errors: {
      server: {
        title: "Server Error",
        description: "Failed to fetch media model pricing",
      },
      network: {
        title: "Network Error",
        description: "Could not connect to pricing APIs",
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
      description: "Successfully fetched and updated media model pricing",
    },
  },
  tags: {
    models: "Models",
  },
};
