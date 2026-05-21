export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  get: {
    title: "License Expiration Date",
    description:
      "Returns the expiration date (epoch ms) for a given license code.",
    licenseCode: {
      label: "License Code",
      description: "The license code to look up (e.g. XXXX-YYYY-ZZZZ-AAAA).",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    response: {
      expirationDate: "Expiration Date",
    },
    widget: {
      title: "Check Expiration Date",
      back: "Back",
      result: "Expiration",
      noResult: "Enter a license code to check its expiration date.",
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
        description: "No permission to check license expiration.",
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
      title: "Expiration Date Retrieved",
      description: "The license expiration date was returned successfully.",
    },
  },
};
