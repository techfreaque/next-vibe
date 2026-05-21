export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  post: {
    title: "Sync Organization VPN",
    description: "Triggers a VPN sync for an organization.",
    orgResourceId: {
      label: "Org Resource ID",
      description: "Optional resource ID of the organization to sync.",
      placeholder: "org.resource.id",
    },
    rootOrgResourceId: {
      label: "Root Org Resource ID",
      description: "Optional root organization resource ID.",
      placeholder: "root.org.resource.id",
    },
    response: {
      result: "Result",
    },
    widget: {
      title: "Sync VPN",
      back: "Back",
    },
    submitButton: {
      label: "Sync VPN",
      loadingText: "Syncing...",
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
        description: "No permission to sync organization VPN.",
      },
      notFound: {
        title: "Not Found",
        description: "Organization not found.",
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
      title: "VPN Synced",
      description: "Organization VPN synced successfully.",
    },
  },
};
