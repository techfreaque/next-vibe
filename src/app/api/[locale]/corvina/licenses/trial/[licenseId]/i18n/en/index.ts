export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  delete: {
    title: "Delete Trial License",
    description: "Permanently deletes a trial license by ID.",
    licenseId: {
      label: "License ID",
      description: "Numeric ID of the trial license to delete.",
    },
    response: {
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
      title: "Delete Trial License",
      back: "Back",
    },
    submitButton: {
      label: "Delete Trial",
      loadingText: "Deleting...",
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
          "The API key does not have permission to delete trial licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No trial license with that ID exists.",
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
      title: "Deleted",
      description: "Trial license deleted successfully.",
    },
  },
};
