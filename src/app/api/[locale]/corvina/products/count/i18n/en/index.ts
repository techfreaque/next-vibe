export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Products",
  },
  get: {
    title: "Product Count",
    description: "Retrieves license count per product.",
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter by organization resource ID.",
    },
    productId: {
      label: "Product ID",
      description: "Filter by specific product ID.",
    },
    page: {
      label: "Page",
      description: "Page number (0-based).",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of results per page.",
    },
    response: {
      items: {
        productId: "Product ID",
        totalCount: "Total Count",
        activeCount: "Active Count",
      },
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
    },
    widget: {
      title: "Product Count",
      noItemsFound: "No products found.",
      back: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Bad request.",
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
        description: "No permission to view product counts.",
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
      title: "Product Count Retrieved",
      description: "Product counts fetched successfully.",
    },
  },
};
