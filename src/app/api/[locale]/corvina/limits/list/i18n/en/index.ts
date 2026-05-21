export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    limits: "Limits",
  },
  get: {
    title: "List Resource Limits",
    description: "Fetches all resource limits for the Corvina tenant.",
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of limits per page.",
    },
    status: {
      label: "Status",
      description: "Filter by limit status — VALID or ALL.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter limits by organization resource ID.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      limits: {
        resourceType: "Resource Type",
        quantity: "Quantity",
        used: "Used",
        targetOrganization: "Target Organization",
        grantingOrganization: "Granting Organization",
        orgResourceId: "Org Resource ID",
      },
    },
    widget: {
      title: "Resource Limits",
      noItemsFound: "No resource limits found.",
      back: "Back",
      refresh: "Refresh",
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
        description: "The API key does not have access to list resource limits.",
      },
      notFound: {
        title: "Not Found",
        description: "No resource limits found for the given parameters.",
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
      description: "Resource limits fetched successfully.",
    },
  },
  post: {
    title: "Create Resource Limit",
    description: "Creates a new resource limit for the Corvina tenant.",
    resourceType: {
      label: "Resource Type",
      description: "The type of resource to limit (e.g. DEVICE).",
    },
    quantity: {
      label: "Quantity",
      description: "Maximum quantity of the resource.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Organization resource ID to associate this limit with.",
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
          "The API key does not have permission to create resource limits.",
      },
      notFound: {
        title: "Not Found",
        description: "The target organization was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "A resource limit for this type already exists.",
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
      title: "Created",
      description: "Resource limit created successfully.",
    },
    submitButton: {
      label: "Create Limit",
      loadingText: "Creating...",
    },
  },
  put: {
    title: "Update Resource Limit",
    description: "Updates an existing resource limit for the Corvina tenant.",
    resourceType: {
      label: "Resource Type",
      description: "The type of resource to update.",
    },
    quantity: {
      label: "Quantity",
      description: "New maximum quantity for the resource.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Organization resource ID identifying the limit to update.",
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
          "The API key does not have permission to update resource limits.",
      },
      notFound: {
        title: "Not Found",
        description: "No resource limit found for the given parameters.",
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
      description: "Resource limit updated successfully.",
    },
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving...",
    },
  },
};
