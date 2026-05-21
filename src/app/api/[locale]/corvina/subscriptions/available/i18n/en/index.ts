export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Check Subscription Availability",
    description:
      "Checks whether a given resource is available within the current subscription quota.",
    resource: {
      label: "Resource",
      description: "The resource type to check availability for (required).",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Limit the check to a specific organization.",
    },
    quantity: {
      label: "Quantity",
      description: "Number of units to check availability for.",
    },
    response: {
      resourceType: "Resource Type",
      available: "Available",
      availableAmount: "Available Amount",
      inDebtSince: "In Debt Since",
    },
    widget: {
      title: "Subscription Availability",
      back: "Back",
      available: "Available",
      unavailable: "Not available",
      units: "units available",
      inDebt: "In debt since",
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
          "The API key does not have access to check subscription availability.",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription found for the given resource.",
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
      description: "Availability checked successfully.",
    },
  },
};
