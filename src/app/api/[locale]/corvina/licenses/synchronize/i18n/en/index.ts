export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  post: {
    title: "Synchronize Resources",
    description:
      "Triggers synchronization of resource consumption between Corvina and connected platforms.",
    orgResourceId: {
      label: "Org Resource ID",
      description: "Limit sync to a specific organization.",
    },
    dryRun: {
      label: "Dry Run",
      description: "Simulate sync without applying changes.",
    },
    submitButton: {
      label: "Synchronize",
      loadingText: "Synchronizing...",
    },
    response: {
      synchronized: "Status",
    },
    widget: {
      title: "Synchronize Resources",
      back: "Back",
      success: "Synchronization complete.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The synchronization request is invalid.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The API key does not have permission to trigger synchronization.",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict during synchronization.",
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
      title: "Synchronized",
      description: "Resource synchronization triggered successfully.",
    },
  },
};
