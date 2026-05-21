export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Products",
  },
  get: {
    title: "List Products",
    description: "Fetches all products available on the Corvina platform.",
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of products per page.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter products by organization resource ID.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      products: {
        id: "ID",
        code: "Code",
        type: "Type",
        label: "Name",
        dealer: "Dealer",
        trial: "Trial",
        creationDate: "Created",
        lastModified: "Updated",
        autorenewDefault: "Auto-Renew Default",
        orgResourceId: "Org Resource ID",
      },
    },
    widget: {
      title: "Products",
      noProductsFound: "No products found.",
      back: "Back",
      compact: {
        type: "type:",
        org: "org:",
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
        description: "The API key does not have access to list products.",
      },
      notFound: {
        title: "Not Found",
        description: "No products found for the given parameters.",
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
      description: "Products fetched successfully.",
    },
  },
};
