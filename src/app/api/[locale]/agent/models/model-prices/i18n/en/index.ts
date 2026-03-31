export const translations = {
  category: "Agent",

  get: {
    title: "Update All Model Prices",
    description:
      "Fetch live pricing for all models from every provider API (OpenRouter, Replicate, etc.) and update models.ts",
    form: {
      title: "Model Price Updater",
    },
    response: {
      summary: {
        title: "Update Summary",
        totalProviders: "Providers Run",
        totalModels: "Total Models",
        modelsUpdated: "Models Updated",
        fileUpdated: "File Updated",
      },
      updates: {
        title: "Updated Models",
        model: {
          modelId: "Model ID",
          name: "Model Name",
          provider: "Provider",
          field: "Price Field",
          value: "New Value",
          source: "Price Source",
        },
      },
      failures: {
        title: "Price Fetch Failures",
        model: {
          modelId: "Model ID",
          provider: "Provider",
          reason: "Reason",
        },
      },
      providerResults: {
        title: "Provider Results",
        model: {
          provider: "Provider",
          modelsFound: "Models Found",
          modelsUpdated: "Updated",
          error: "Error",
        },
      },
    },
    errors: {
      server: {
        title: "Server Error",
        description: "Failed to update model prices",
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
      description: "Successfully fetched and updated all model prices",
    },
  },
  tags: {
    models: "Models",
  },
  updateAllModelPrices: {
    name: "Update All Model Prices",
    description:
      "Fetches live pricing for all models from every provider API and updates models.ts",
  },
};
