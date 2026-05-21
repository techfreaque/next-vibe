export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licenses",
  },
  get: {
    title: "Get License",
    description: "Fetches a single license by ID.",
    licenseId: {
      label: "License ID",
      description: "Numeric license ID.",
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
      title: "License Details",
      expiringSoon: "Expiring soon",
      expired: "Expired",
      active: "Active",
      trial: "Trial",
      noExpiry: "No expiry",
      actions: {
        update: "Edit",
        renew: "Renew",
        delete: "Delete",
        back: "Back",
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
        description: "The API key does not have access to this license.",
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
      title: "Success",
      description: "License fetched successfully.",
    },
  },
  put: {
    title: "Update License",
    description: "Updates auto-renew and expiration date of a license.",
    licenseId: {
      label: "License ID",
      description: "Numeric license ID.",
    },
    autorenew: {
      label: "Auto-Renew",
      description: "Enable or disable automatic renewal.",
    },
    expirationDate: {
      label: "Expiration Date",
      description: "New expiration date as epoch milliseconds (null to clear).",
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
        description: "The API key does not have permission to update licenses.",
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
      title: "Updated",
      description: "License updated successfully.",
    },
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving...",
    },
  },
  delete: {
    title: "Delete License",
    description: "Permanently deletes a license by ID.",
    licenseId: {
      label: "License ID",
      description: "Numeric license ID to delete.",
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
        description: "The API key does not have permission to delete licenses.",
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
      title: "Deleted",
      description: "License deleted successfully.",
    },
    submitButton: {
      label: "Delete License",
      loadingText: "Deleting...",
    },
  },
  post: {
    title: "Renew License",
    description: "Renews a license by ID.",
    licenseId: {
      label: "License ID",
      description: "Numeric license ID to renew.",
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
    submitButton: {
      label: "Renew License",
      loadingText: "Renewing...",
    },
  },
};
