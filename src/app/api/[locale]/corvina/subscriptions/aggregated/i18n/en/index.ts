export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Aggregated Subscriptions",
    description:
      "Fetches aggregated subscription usage across all resources for the tenant.",
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter aggregated data by organization resource ID.",
    },
    response: {
      items: {
        resourceType: "Resource Type",
        org: "Organization",
        quantity: "Quantity",
        used: "Used",
        licensed: "Licensed",
        granted: "Granted",
        grantedUsed: "Granted Used",
        lastUpdateFreeQuantity: "Last Free Quantity Update",
      },
    },
    widget: {
      title: "Aggregated Subscriptions",
      noItemsFound: "No aggregated data found.",
      back: "Back",
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
        description:
          "The API key does not have access to aggregated subscriptions.",
      },
      notFound: {
        title: "Not Found",
        description: "No aggregated data found for the given parameters.",
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
      title: "Success",
      description: "Aggregated subscriptions fetched successfully.",
    },
  },
};
