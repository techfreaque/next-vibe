export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Preauthorized Transactions",
  },
  post: {
    title: "Sync Preauthorized Transaction Executions",
    description:
      "Triggers a synchronization of all preauthorized transaction execution states.",
    response: {
      synchronized: "Synchronized",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
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
        description: "No permission to sync executions.",
      },
      notFound: { title: "Not Found", description: "Resource not found." },
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
      title: "Sync Complete",
      description: "Execution states synchronized successfully.",
    },
    submitButton: {
      label: "Sync Executions",
      loadingText: "Syncing...",
    },
    widget: {
      back: "Back",
      synced: "Execution states synchronized.",
    },
  },
};
