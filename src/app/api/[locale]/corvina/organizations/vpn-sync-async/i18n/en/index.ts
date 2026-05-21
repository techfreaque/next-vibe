export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  post: {
    title: "Sync Organization VPN (Async)",
    description: "Triggers an asynchronous VPN sync job for an organization.",
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
      id: "Job ID",
      orgResourceId: "Org Resource ID",
      rootOrgResourceId: "Root Org Resource ID",
      status: "Status",
      error: "Error",
    },
    widget: {
      title: "Sync VPN (Async)",
      back: "Back",
    },
    submitButton: {
      label: "Start Async Sync",
      loadingText: "Starting...",
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
        description: "No permission to trigger async VPN sync.",
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
      title: "Async Sync Started",
      description: "VPN sync job created. Use the job ID to track progress.",
    },
  },
};
