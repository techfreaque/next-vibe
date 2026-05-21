export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Subscriptions Summary",
    description:
      "Fetches a per-license summary of subscriptions including resource breakdowns.",
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter by organization resource ID.",
    },
    includeExpired: {
      label: "Include Expired",
      description: "When enabled, includes expired subscriptions in results.",
    },
    response: {
      items: {
        orgResourceId: "Org Resource ID",
        licenseId: "License ID",
        productCode: "Product Code",
        productLabel: "Product",
        productType: "Type",
        licenseCode: "License Code",
        currency: "Currency",
        price: "Price",
        autorenew: "Auto-Renew",
        trial: "Trial",
        expirationDate: "Expires",
        activationDate: "Activated",
        creationDate: "Created",
        resources: {
          resourceType: "Resource Type",
          quantity: "Quantity",
          used: "Used",
          expired: "Expired",
        },
      },
    },
    widget: {
      title: "Subscription Summary",
      noItemsFound: "No subscription summaries found.",
      back: "Back",
      resources: "Resources",
      trial: "Trial",
      autorenewSymbol: "↻",
      compact: {
        exp: "exp:",
        autorenew: "renew:",
        separator: "·",
      },
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
          "The API key does not have access to subscription summaries.",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription summaries found.",
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
      description: "Subscription summary fetched successfully.",
    },
  },
};
