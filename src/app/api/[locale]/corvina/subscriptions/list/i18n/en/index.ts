export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "List Subscriptions",
    description: "Fetches all subscriptions for the Corvina tenant.",
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of subscriptions per page.",
    },
    status: {
      label: "Status",
      description: "Filter by subscription status — VALID or ALL.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter subscriptions by organization resource ID.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      subscriptions: {
        resourceType: "Resource Type",
        quantity: "Quantity",
        used: "Used",
        expirationDate: "Expires",
        creationDate: "Created",
        expired: "Expired",
        productCode: "Product Code",
        productLabel: "Product",
        licenseId: "License ID",
        productId: "Product ID",
      },
    },
    widget: {
      title: "Subscriptions",
      noItemsFound: "No subscriptions found.",
      back: "Back",
      refresh: "Refresh",
      expired: "Expired",
      expiringSoon: "Expiring soon",
      prevPage: "Previous",
      nextPage: "Next",
      nav: {
        orgs: "Organizations",
        aggregated: "Aggregated",
        summary: "Summary",
        history: "History",
      },
      compact: {
        exp: "exp:",
        qty: "qty:",
        used: "used:",
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
        description: "The API key does not have access to list subscriptions.",
      },
      notFound: {
        title: "Not Found",
        description: "No subscriptions found for the given parameters.",
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
      description: "Subscriptions fetched successfully.",
    },
  },
};
