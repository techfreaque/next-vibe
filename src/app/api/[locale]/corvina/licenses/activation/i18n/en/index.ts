export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  post: {
    title: "Activate License",
    description: "Activates a license using its code.",
    licenseCode: {
      label: "License Code",
      description: "The license activation code.",
      placeholder: "XXXX-YYYY-ZZZZ",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Target organization for activation.",
      placeholder: "exorde.connex.example",
    },
    submitButton: {
      label: "Activate",
      loadingText: "Activating...",
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
      used: "Used",
      code: "Code",
      orgResourceId: "Org",
      externalRef: "External Ref",
      price: "Price",
      currency: "Currency",
      autorenew: "Auto-renew",
    },
    widget: {
      title: "Activate License",
      back: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The activation request is invalid.",
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
          "The API key does not have permission to activate licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "The license code was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "This license has already been activated.",
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
      title: "License Activated",
      description: "License activated successfully.",
    },
  },
};
