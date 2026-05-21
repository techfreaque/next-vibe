export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Products",
  },
  post: {
    title: "Create Product",
    description: "Creates a new product on the Corvina platform.",
    code: {
      label: "Product Code",
      description: "Unique code identifying this product.",
      placeholder: "CORVINA_STANDARD",
    },
    type: {
      label: "Product Type",
      description: "e.g. STANDARD",
      placeholder: "STANDARD",
    },
    productLabel: {
      label: "Label",
      description: "Human-readable name for this product.",
      placeholder: "Corvina Standard",
    },
    trial: {
      label: "Trial",
      description: "Mark this product as a trial offering.",
    },
    autorenewDefaultValueForNewLicenses: {
      label: "Auto-Renew Default",
      description:
        "Default auto-renew setting for new licenses of this product.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Assign this product to a specific organization resource.",
      placeholder: "exorde.connex.connectika",
    },
    submitButton: {
      label: "Create Product",
      loadingText: "Creating...",
    },
    response: {
      id: "Product ID",
      code: "Code",
      type: "Type",
      productLabel: "Label",
      dealer: "Dealer",
      trial: "Trial",
      creationDate: "Created",
      lastModified: "Last Modified",
      autorenewDefaultValueForNewLicenses: "Auto-Renew Default",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      title: "Create Product",
      back: "Back",
      resultTitle: "Product created",
      noData: "No product data",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The product creation request is invalid.",
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
        description: "The API key does not have permission to create products.",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "A product with this code already exists.",
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
      title: "Product Created",
      description: "The product was created successfully.",
    },
  },
};
