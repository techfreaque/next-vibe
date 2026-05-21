export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  post: {
    title: "Renew License",
    description: "Renews a license by ID.",
    licenseId: {
      label: "License ID",
      description: "Numeric license ID to renew.",
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
      title: "Renew License",
      back: "Back",
    },
    submitButton: {
      label: "Renew License",
      loadingText: "Renewing...",
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
        description: "The API key does not have permission to renew licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No license with that ID exists.",
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
      title: "Renewed",
      description: "License renewed successfully.",
    },
  },
};
