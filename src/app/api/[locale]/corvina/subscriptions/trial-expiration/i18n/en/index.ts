export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Trial Expiration",
    description: "Returns the trial expiration date for the current tenant.",
    orgResourceId: {
      label: "Org Resource ID",
      description: "Limit the query to a specific organization.",
    },
    response: {
      expirationDate: "Trial Expiration Date",
    },
    widget: {
      title: "Trial Expiration",
      back: "Back",
      noExpiration: "No trial expiration date set.",
      expiringSoon: "Trial expires soon",
      expired: "Trial has expired",
      expiresOn: "Expires on",
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
          "The API key does not have access to trial expiration data.",
      },
      notFound: {
        title: "Not Found",
        description: "No trial expiration data found.",
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
      description: "Trial expiration date fetched successfully.",
    },
  },
};
