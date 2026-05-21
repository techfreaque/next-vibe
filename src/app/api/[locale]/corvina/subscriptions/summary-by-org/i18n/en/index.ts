export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Subscriptions Summary by Org",
    description:
      "Fetches a paginated list of subscription summaries grouped by organization.",
    createdByOrgResourceId: {
      label: "Created By Org Resource ID",
      description: "The parent organization resource ID (required).",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of results per page.",
    },
    expired: {
      label: "Expired",
      description: "When set, filters by expired status.",
    },
    search: {
      label: "Search",
      description: "Search term to filter results.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
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
      title: "Subscriptions by Org",
      noItemsFound: "No subscription summaries found.",
      back: "Back",
      trial: "Trial",
      autorenewSymbol: "↻",
      compact: {
        exp: "exp:",
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
          "The API key does not have access to org subscription summaries.",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription summaries found for the given org.",
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
      description: "Org subscription summaries fetched successfully.",
    },
  },
};
