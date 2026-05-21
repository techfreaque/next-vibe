export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Subscription History",
    description:
      "Fetches historical subscription usage data for a given date range.",
    fromDate: {
      label: "From Date",
      description: "Start of the date range (e.g. 2024-01-01).",
    },
    toDate: {
      label: "To Date",
      description: "End of the date range (e.g. 2024-12-31).",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter results by organization resource ID.",
    },
    resourceId: {
      label: "Resource ID",
      description: "Filter results by resource ID.",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of history entries per page.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      items: {
        resourceType: "Resource Type",
        quantity: "Quantity",
        used: "Used",
        granted: "Granted",
        grantedUsed: "Granted Used",
        licensed: "Licensed",
        timestamp: "Timestamp",
      },
    },
    widget: {
      title: "Subscription History",
      noItemsFound: "No history entries found.",
      back: "Back",
      fetch: "Fetch History",
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
          "The API key does not have access to subscription history.",
      },
      notFound: {
        title: "Not Found",
        description: "No history found for the given parameters.",
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
      description: "Subscription history fetched successfully.",
    },
  },
};
