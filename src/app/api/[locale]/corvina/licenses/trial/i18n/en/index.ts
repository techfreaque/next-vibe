export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  post: {
    title: "Create Trial License",
    description: "Creates a trial license for a given device.",
    deviceLicense: {
      label: "Device License Key",
      description: "The device license key to activate a trial for.",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    targetOrganization: {
      label: "Target Organization",
      description:
        "Organization resource ID that receives the trial (optional).",
      placeholder: "exorde.connex.connectika",
    },
    ownerOrganization: {
      label: "Owner Organization",
      description: "Organization resource ID that owns the trial (optional).",
      placeholder: "exorde.connex.connectika",
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
      title: "Create Trial License",
      back: "Back",
      resultTitle: "Trial License Created",
    },
    submitButton: {
      label: "Create Trial",
      loadingText: "Creating...",
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
          "The API key does not have permission to create trial licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "The device license was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "A trial license for this device already exists.",
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
      title: "Trial Created",
      description: "Trial license created successfully.",
    },
  },
};
