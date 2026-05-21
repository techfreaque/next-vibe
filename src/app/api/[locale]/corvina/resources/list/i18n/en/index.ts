export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    resources: "Resources",
  },
  get: {
    title: "Resources",
    description: "Lists all available resource types in the Corvina platform.",
    response: {
      items: {
        id: "ID",
        type: "Resource Type",
        maxActive: "Max Active",
        consumable: "Consumable",
      },
    },
    widget: {
      title: "Resources",
      noItemsFound: "No resources found.",
      back: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Bad request.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach Corvina.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission to view resources.",
      },
      notFound: {
        title: "Not Found",
        description: "No resources found.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Resources Retrieved",
      description: "Resources fetched successfully.",
    },
  },
};
