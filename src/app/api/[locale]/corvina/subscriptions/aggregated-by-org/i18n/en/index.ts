export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  post: {
    title: "Aggregated Usage by Org",
    description:
      "Returns aggregated resource usage grouped by specified organizations.",
    organizations: {
      label: "Organizations",
      description: "Comma-separated list of organization resource IDs.",
      placeholder: "org1.example,org2.example",
    },
    response: {
      items: {
        org: "Organization",
        resourceType: "Resource Type",
        quantity: "Quantity",
        used: "Used",
        licensed: "Licensed",
        granted: "Granted",
        grantedUsed: "Granted Used",
        lastUpdateFreeQuantity: "Last Free Update",
      },
    },
    widget: {
      title: "Aggregated Usage by Org",
      noItemsFound: "No data found.",
      back: "Back",
    },
    submitButton: {
      label: "Fetch",
      loadingText: "Loading...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request is invalid.",
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
        description: "No permission.",
      },
      notFound: {
        title: "Not Found",
        description: "No data found.",
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
      title: "Data Retrieved",
      description: "Aggregated usage by org fetched successfully.",
    },
  },
};
