export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  get: {
    title: "Validate License",
    description: "Validates a license code and returns its details.",
    licenseCode: {
      label: "License Code",
      description: "The license code to validate (e.g. XXXX-YYYY-ZZZZ-AAAA).",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    response: {
      licenseId: "License ID",
      productCode: "Product Code",
      productLabel: "Product",
      productType: "Type",
      productTrial: "Trial",
      creationDate: "Created",
      expirationDate: "Expires",
      activationDate: "Activated",
      used: "In Use",
      code: "License Code",
      externalRef: "External Ref",
      price: "Price",
      currency: "Currency",
      autorenew: "Auto-Renew",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      title: "Validate License",
      back: "Back",
      valid: "Valid",
      invalid: "Invalid",
      noResult: "Enter a license code to validate.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The license code format is invalid.",
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
        description: "No permission to validate licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No license found with that code.",
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
      title: "License Valid",
      description: "The license code is valid.",
    },
  },
};
