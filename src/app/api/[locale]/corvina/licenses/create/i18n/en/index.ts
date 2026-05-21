export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  post: {
    title: "Create License",
    description: "Creates a new license on the Corvina platform.",
    productId: {
      label: "Product ID",
      description: "Numeric ID of the Corvina product to license.",
      placeholder: "42",
    },
    autorenew: {
      label: "Auto-Renew",
      description: "Automatically renew this license before it expires.",
    },
    expirationDate: {
      label: "Expiration Date",
      description:
        "License expiry as epoch milliseconds. Leave blank for no expiry.",
      placeholder: "1800000000000",
    },
    price: {
      label: "Price",
      description: "Purchase price for this license.",
      placeholder: "99.00",
    },
    currency: {
      label: "Currency",
      description: "ISO 4217 currency code (e.g. EUR, USD).",
      placeholder: "EUR",
    },
    externalRef: {
      label: "External Reference",
      description: "Optional external identifier for cross-system tracking.",
      placeholder: "order-12345",
    },
    targetOrgResourceId: {
      label: "Target Org Resource ID",
      description:
        "Assign the license directly to a specific organization resource.",
      placeholder: "exorde.connex.connectika",
    },
    submitButton: {
      label: "Create License",
      loadingText: "Creating...",
    },
    response: {
      licenseId: "License ID",
      productCode: "Product Code",
      productLabel: "Product",
      productType: "Type",
      productTrial: "Trial",
      creationDate: "Created",
      activationDate: "Activated",
      used: "In Use",
      code: "License Code",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      title: "Create License",
      back: "Back",
      resultTitle: "License created",
      noData: "No license data",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The license creation request is invalid.",
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
        description: "The API key does not have permission to create licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "The requested product was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "A license conflict occurred.",
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
      title: "License Created",
      description: "The license was created successfully.",
    },
  },
};
