export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  get: {
    title: "List Licenses",
    description: "Fetches all licenses registered on the Corvina tenant.",
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of licenses per page.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter licenses by organization resource ID.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      licenses: {
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
        externalRef: "External Ref",
        price: "Price",
        currency: "Currency",
        autorenew: "Auto-Renew",
        orgResourceId: "Org Resource ID",
      },
    },
    widget: {
      title: "Licenses",
      noLicensesFound: "No licenses found.",
      back: "Back",
      refresh: "Refresh",
      prevPage: "Previous",
      nextPage: "Next",
      nav: {
        orgs: "Organizations",
        create: "New License",
        trial: "Trial License",
      },
      compact: {
        exp: "exp:",
        autorenew: "autorenew:",
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
        description: "The API key does not have access to list licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No licenses found for the given parameters.",
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
      description: "Licenses fetched successfully.",
    },
  },
};
